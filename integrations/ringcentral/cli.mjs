#!/usr/bin/env node

import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAuthorizationUrl,
  resolveCredentialMode,
} from "./src/auth.mjs";
import { RingCentralClient } from "./src/client.mjs";
import { normalizeConfig, readConfigFile } from "./src/config.mjs";
import { runOAuthLogin } from "./src/oauth-login.mjs";
import { separateVoiceAssistantPlan } from "./src/voice-plan.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultConfigPath = path.join(here, "config.json");

function usage() {
  console.log(`RingCentral bridge (read-first; writes are guarded)

Usage:
  node cli.mjs doctor
  node cli.mjs auth-url
  node cli.mjs login
  node cli.mjs account
  node cli.mjs extension
  node cli.mjs extensions [--type ApplicationExtension] [--status Enabled]
  node cli.mjs chats [--limit N] [--page-token TOKEN]
  node cli.mjs chat <chat-id> [--limit N] [--page-token TOKEN]
  node cli.mjs messages [--date-from ISO] [--date-to ISO] [--type SMS,MMS,VoiceMail]
  node cli.mjs calls [--date-from ISO] [--date-to ISO]
  node cli.mjs calls-account [--date-from ISO] [--date-to ISO]
  node cli.mjs voice-plan
  node cli.mjs post <chat-id> <text> --confirm-write

Load local credentials with Node 20+:
  node --env-file=.env cli.mjs doctor
`);
}

function option(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  args.splice(index, 2);
  return value;
}

function hasFlag(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return false;
  args.splice(index, 1);
  return true;
}

function loadRawConfig() {
  const configPath = process.env.RINGCENTRAL_CONFIG
    ? path.resolve(process.env.RINGCENTRAL_CONFIG)
    : defaultConfigPath;
  const raw = readConfigFile(configPath);
  if (process.env.RINGCENTRAL_SERVER) raw.endpoint = process.env.RINGCENTRAL_SERVER;
  return { configPath, raw };
}

function loadConfig({ requireCredential = true } = {}) {
  const loaded = loadRawConfig();
  const config = normalizeConfig(loaded.raw, process.env, { requireCredential });
  return { ...loaded, config };
}

function makeClient(config) {
  return new RingCentralClient({ config, env: process.env });
}

function printJson(payload) {
  console.log(JSON.stringify(payload, null, 2));
}

async function main() {
  const args = process.argv.slice(2);
  const command = args.shift() ?? "help";

  if (command === "help" || command === "--help" || command === "-h") {
    usage();
    return;
  }

  if (command === "doctor") {
    const { configPath, config } = loadConfig({ requireCredential: false });
    let credential;
    try {
      credential = resolveCredentialMode(process.env);
    } catch (error) {
      credential = { mode: null, message: error.message };
    }
    printJson({
      configPath,
      endpoint: config.endpoint,
      scopes: config.scopes,
      credentialMode: credential.mode,
      credentialMessage: credential.message ?? null,
      writeEnabled: config.writeEnabled,
      allowlistedChatIds: config.allowlistedChatIds,
      next: config.auth.tokenSource ? "Run account or chats" : "Set one local credential, then rerun doctor",
    });
    return;
  }

  if (command === "auth-url") {
    const { config } = loadConfig({ requireCredential: false });
    const clientId = process.env.RINGCENTRAL_CLIENT_ID;
    const redirectUri = process.env.RINGCENTRAL_REDIRECT_URI;
    const state = process.env.RINGCENTRAL_OAUTH_STATE || crypto.randomUUID();
    const scope = process.env.RINGCENTRAL_OAUTH_SCOPE || config.scopes.join(" ");
    printJson({
      url: buildAuthorizationUrl({
        server: config.endpoint,
        clientId,
        redirectUri,
        state,
        scope,
        codeChallenge: process.env.RINGCENTRAL_CODE_CHALLENGE,
      }),
      state,
      note: "Open the URL locally; do not paste the authorization code into chat.",
    });
    return;
  }

  if (command === "login") {
    const { config } = loadConfig({ requireCredential: false });
    const redirectUri = process.env.RINGCENTRAL_REDIRECT_URI;
    const scope = process.env.RINGCENTRAL_OAUTH_SCOPE || config.scopes.join(" ");
    const result = await runOAuthLogin({
      server: config.endpoint,
      clientId: process.env.RINGCENTRAL_CLIENT_ID,
      clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
      redirectUri,
      scope,
      env: process.env,
    });
    printJson({ stored: true, tokenFile: result.stored });
    return;
  }

  if (command === "voice-plan") {
    printJson(separateVoiceAssistantPlan);
    return;
  }

  const { config } = loadConfig({ requireCredential: true });
  const client = makeClient(config);

  if (command === "account") {
    printJson(await client.getAccount());
    return;
  }
  if (command === "extension") {
    printJson(await client.getExtension());
    return;
  }
  if (command === "extensions") {
    const type = option(args, "--type");
    const status = option(args, "--status");
    const limit = option(args, "--limit");
    printJson(await client.listExtensions({
      type,
      status,
      perPage: limit ? Number(limit) : undefined,
    }));
    return;
  }
  if (command === "chats") {
    const limit = option(args, "--limit");
    const pageToken = option(args, "--page-token");
    printJson(await client.listChats({
      recordCount: limit ? Number(limit) : undefined,
      pageToken,
    }));
    return;
  }
  if (command === "chat") {
    const chatId = args.shift();
    if (!chatId) throw new Error("chat requires a chat-id");
    const limit = option(args, "--limit");
    const pageToken = option(args, "--page-token");
    printJson(await client.listPosts(chatId, {
      recordCount: limit ? Number(limit) : undefined,
      pageToken,
    }));
    return;
  }
  if (command === "messages") {
    const dateFrom = option(args, "--date-from");
    const dateTo = option(args, "--date-to");
    const types = option(args, "--type");
    printJson(await client.listMessageStore({
      dateFrom,
      dateTo,
      messageType: types ? types.split(",").map((value) => value.trim()).filter(Boolean) : undefined,
    }));
    return;
  }
  if (command === "calls") {
    const dateFrom = option(args, "--date-from");
    const dateTo = option(args, "--date-to");
    printJson(await client.listCallLog({ dateFrom, dateTo }));
    return;
  }
  if (command === "calls-account") {
    const dateFrom = option(args, "--date-from");
    const dateTo = option(args, "--date-to");
    const limit = option(args, "--limit");
    printJson(await client.listAccountCallLog({
      dateFrom,
      dateTo,
      perPage: limit ? Number(limit) : undefined,
    }));
    return;
  }
  if (command === "post") {
    const chatId = args.shift();
    const confirmed = hasFlag(args, "--confirm-write");
    const text = args.join(" ").trim();
    if (!chatId || !text) throw new Error("post requires <chat-id> <text> --confirm-write");
    printJson(await client.postChatMessage(chatId, text, { confirmed }));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(`RingCentral bridge error: ${error.message}`);
  process.exitCode = 1;
});
