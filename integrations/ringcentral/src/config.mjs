import fs from "node:fs";
import { resolveCredentialMode } from "./auth.mjs";

const RINGCENTRAL_HOSTS = new Set([
  "platform.ringcentral.com",
  "platform.devtest.ringcentral.com",
]);

const DEFAULT_SCOPES = [
  "ReadAccounts",
  "ReadMessages",
  "ReadCallLog",
  "TeamMessaging",
];

function resolveTokenSource(env, { requireCredential }) {
  try {
    return resolveCredentialMode(env).mode;
  } catch (error) {
    if (requireCredential) {
      throw new Error(
        "Provide a local RingCentral credential via RINGCENTRAL_ACCESS_TOKEN, RINGCENTRAL_USER_JWT, or RINGCENTRAL_REFRESH_TOKEN, or complete OAuth login",
      );
    }
    if (!/No RingCentral credential found/.test(error.message)) throw error;
    return null;
  }
}

function normalizeAllowlist(raw) {
  const ids = raw?.allowlist?.chat_ids;
  if (ids === undefined) return [];
  if (!Array.isArray(ids) || ids.some((value) => typeof value !== "string")) {
    throw new Error("allowlist.chat_ids must be an array of chat ID strings");
  }
  return [...new Set(ids.map((value) => value.trim()).filter(Boolean))];
}

export function normalizeConfig(raw = {}, env = process.env, options = {}) {
  const requireCredential = options.requireCredential ?? true;
  const endpointValue = String(raw.endpoint ?? "").trim().replace(/\/+$/, "");

  let endpoint;
  try {
    endpoint = new URL(endpointValue);
  } catch {
    throw new Error("RingCentral API endpoint must be a valid URL");
  }

  if (endpoint.protocol !== "https:") {
    throw new Error("RingCentral API endpoint must use HTTPS");
  }
  if (!RINGCENTRAL_HOSTS.has(endpoint.hostname.toLowerCase())) {
    throw new Error("RingCentral API endpoint must use a RingCentral API endpoint");
  }
  if (endpoint.pathname !== "" && endpoint.pathname !== "/") {
    throw new Error("RingCentral API endpoint must not include a path");
  }

  const tokenSource = resolveTokenSource(env, { requireCredential });
  const scopes = raw.scopes ?? DEFAULT_SCOPES;
  if (!Array.isArray(scopes) || scopes.some((scope) => typeof scope !== "string" || !scope.trim())) {
    throw new Error("scopes must be an array of non-empty strings");
  }

  const timeout = Number(raw.timeout ?? 30);
  const retryAttempts = Number(raw.retry_attempts ?? 2);
  if (!Number.isInteger(timeout) || timeout < 1 || timeout > 300) {
    throw new Error("timeout must be an integer between 1 and 300 seconds");
  }
  if (!Number.isInteger(retryAttempts) || retryAttempts < 0 || retryAttempts > 5) {
    throw new Error("retry_attempts must be an integer between 0 and 5");
  }

  const allowlistedChatIds = normalizeAllowlist(raw);
  const writeEnabled = raw.write_enabled === true && env.RINGCENTRAL_WRITE_ENABLED === "true";

  return {
    endpoint: endpoint.toString().replace(/\/$/, ""),
    timeout,
    retryAttempts,
    scopes: [...new Set(scopes.map((scope) => scope.trim()))],
    auth: { tokenSource },
    writeEnabled,
    allowlistedChatIds,
    requireWriteConfirmation: raw.require_confirm_write !== false,
  };
}

export function readConfigFile(configPath) {
  const text = fs.readFileSync(configPath, "utf8");
  return JSON.parse(text);
}

export { DEFAULT_SCOPES, RINGCENTRAL_HOSTS };
