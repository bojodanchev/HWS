import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const tokenFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../tokens/oauth.json");

function tokenFilePath(env = process.env) {
  return env.RINGCENTRAL_TOKEN_FILE
    ? path.resolve(env.RINGCENTRAL_TOKEN_FILE)
    : tokenFile;
}

function hasStoredToken(env = process.env) {
  try {
    const parsed = JSON.parse(fs.readFileSync(tokenFilePath(env), "utf8"));
    return nonEmpty(parsed.access_token) || nonEmpty(parsed.refresh_token);
  } catch {
    return false;
  }
}

function readStoredToken(env = process.env) {
  try {
    return JSON.parse(fs.readFileSync(tokenFilePath(env), "utf8"));
  } catch {
    return null;
  }
}

function writeStoredToken(payload, env = process.env) {
  const destination = tokenFilePath(env);
  fs.mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
  fs.writeFileSync(destination, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
  fs.chmodSync(destination, 0o600);
  return destination;
}

export function resolveCredentialMode(env = process.env) {
  const candidates = [
    ["access_token", "RINGCENTRAL_ACCESS_TOKEN"],
    ["jwt", "RINGCENTRAL_USER_JWT"],
    ["refresh_token", "RINGCENTRAL_REFRESH_TOKEN"],
  ].filter(([, envName]) => nonEmpty(env[envName]));

  if (candidates.length > 1) {
    throw new Error(
      "Set exactly one of RINGCENTRAL_ACCESS_TOKEN, RINGCENTRAL_USER_JWT, or RINGCENTRAL_REFRESH_TOKEN",
    );
  }
  if (candidates.length === 0) {
    if (hasStoredToken(env)) return { mode: "oauth_file", envName: null };
    throw new Error(
      "No RingCentral credential found; set RINGCENTRAL_ACCESS_TOKEN, RINGCENTRAL_USER_JWT, or RINGCENTRAL_REFRESH_TOKEN",
    );
  }
  return { mode: candidates[0][0], envName: candidates[0][1] };
}

export function buildAuthorizationUrl({
  server,
  clientId,
  redirectUri,
  state,
  scope,
  codeChallenge,
}) {
  if (!nonEmpty(clientId)) throw new Error("RINGCENTRAL_CLIENT_ID is required");
  if (!nonEmpty(redirectUri)) throw new Error("RINGCENTRAL_REDIRECT_URI is required");
  const url = new URL("/restapi/oauth/authorize", server);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  if (nonEmpty(state)) url.searchParams.set("state", state);
  if (nonEmpty(scope)) url.searchParams.set("scope", scope);
  if (nonEmpty(codeChallenge)) {
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");
  }
  return url.toString();
}

async function exchangeToken({ server, clientId, clientSecret, form, fetchImpl = globalThis.fetch }) {
  if (!nonEmpty(clientId) || !nonEmpty(clientSecret)) {
    throw new Error("RINGCENTRAL_CLIENT_ID and RINGCENTRAL_CLIENT_SECRET are required for token exchange");
  }
  const response = await fetchImpl(new URL("/restapi/oauth/token", server), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams(form),
  });
  if (!response.ok) throw new Error(`RingCentral token exchange failed with HTTP ${response.status}`);
  const payload = await response.json();
  if (!nonEmpty(payload.access_token)) throw new Error("RingCentral token exchange returned no access token");
  return payload;
}

export function exchangeJwt({ server, clientId, clientSecret, jwt, fetchImpl }) {
  return exchangeToken({
    server,
    clientId,
    clientSecret,
    fetchImpl,
    form: {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    },
  });
}

export function exchangeRefreshToken({ server, clientId, clientSecret, refreshToken, fetchImpl }) {
  return exchangeToken({
    server,
    clientId,
    clientSecret,
    fetchImpl,
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  });
}

export function createPkcePair() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function exchangeAuthorizationCode({
  server,
  clientId,
  clientSecret,
  code,
  redirectUri,
  codeVerifier,
  fetchImpl,
}) {
  const form = {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  };
  if (nonEmpty(codeVerifier)) form.code_verifier = codeVerifier;
  return exchangeToken({ server, clientId, clientSecret, form, fetchImpl });
}

async function refreshStoredToken({ server, env, stored, fetchImpl }) {
  const payload = await exchangeRefreshToken({
    server,
    clientId: env.RINGCENTRAL_CLIENT_ID,
    clientSecret: env.RINGCENTRAL_CLIENT_SECRET,
    refreshToken: stored.refresh_token,
    fetchImpl,
  });
  writeStoredToken({
    ...payload,
    expires_at: payload.expires_in ? Date.now() + Number(payload.expires_in) * 1000 : undefined,
  }, env);
  return payload.access_token;
}

export async function getAccessToken({ server, env = process.env, fetchImpl = globalThis.fetch }) {
  const { mode, envName } = resolveCredentialMode(env);
  if (mode === "access_token") return env[envName];
  const common = {
    server,
    clientId: env.RINGCENTRAL_CLIENT_ID,
    clientSecret: env.RINGCENTRAL_CLIENT_SECRET,
    fetchImpl,
  };
  if (mode === "jwt") return (await exchangeJwt({ ...common, jwt: env[envName] })).access_token;
  if (mode === "refresh_token") {
    return (await exchangeRefreshToken({ ...common, refreshToken: env[envName] })).access_token;
  }

  const stored = readStoredToken(env);
  if (!stored) throw new Error("Stored RingCentral OAuth token could not be read");
  const expiresAt = Number(stored.expires_at ?? 0);
  if (nonEmpty(stored.access_token) && (!expiresAt || expiresAt > Date.now() + 60_000)) {
    return stored.access_token;
  }
  if (nonEmpty(stored.refresh_token)) {
    return refreshStoredToken({ server, env, stored, fetchImpl });
  }
  throw new Error("Stored RingCentral OAuth token is expired and has no refresh token");
}

export { hasStoredToken, readStoredToken, tokenFilePath, writeStoredToken };
