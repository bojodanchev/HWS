import { createServer } from "node:http";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { buildAuthorizationUrl, createPkcePair, exchangeAuthorizationCode, writeStoredToken } from "./auth.mjs";

function localRedirect(redirectUri) {
  const url = new URL(redirectUri);
  if (url.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(url.hostname)) {
    throw new Error("OAuth login only accepts an http localhost redirect URI");
  }
  if (!url.port) throw new Error("OAuth redirect URI must include a local port");
  return { url, host: url.hostname, port: Number(url.port), pathname: url.pathname || "/" };
}

function openBrowser(url) {
  if (process.env.RINGCENTRAL_NO_OPEN === "true") return false;
  const child = spawn("open", [url], { stdio: "ignore", detached: true });
  child.unref();
  return true;
}

export async function runOAuthLogin({
  server,
  clientId,
  clientSecret,
  redirectUri,
  scope,
  env = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = 300_000,
} = {}) {
  if (!clientId) throw new Error("RINGCENTRAL_CLIENT_ID is required for OAuth login");
  if (!clientSecret) throw new Error("RINGCENTRAL_CLIENT_SECRET is required for OAuth login");
  const redirect = localRedirect(redirectUri);
  const { verifier, challenge } = createPkcePair();
  const state = cryptoRandomState();
  const authorizationUrl = buildAuthorizationUrl({
    server,
    clientId,
    redirectUri,
    state,
    scope,
    codeChallenge: challenge,
  });

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      callback();
    };
    const timeout = setTimeout(() => {
      serverInstance.close();
      finish(() => reject(new Error("OAuth login timed out waiting for the localhost callback")));
    }, timeoutMs);
    const serverInstance = createServer(async (request, response) => {
      try {
        const callbackUrl = new URL(request.url ?? "/", redirect.url.origin);
        if (callbackUrl.pathname !== redirect.pathname) {
          response.writeHead(404, { "Content-Type": "text/plain" });
          response.end("Not found");
          return;
        }
        const callbackError = callbackUrl.searchParams.get("error");
        if (callbackError) throw new Error(`RingCentral OAuth was denied (${callbackError})`);
        if (callbackUrl.searchParams.get("state") !== state) {
          throw new Error("RingCentral OAuth state did not match");
        }
        const code = callbackUrl.searchParams.get("code");
        if (!code) throw new Error("RingCentral OAuth callback did not contain an authorization code");

        const payload = await exchangeAuthorizationCode({
          server,
          clientId,
          clientSecret,
          code,
          redirectUri,
          codeVerifier: verifier,
          fetchImpl,
        });
        const stored = writeStoredToken({
          ...payload,
          expires_at: payload.expires_in ? Date.now() + Number(payload.expires_in) * 1000 : undefined,
        }, env);
        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("RingCentral authorization complete. You can close this window.");
        serverInstance.close();
        finish(() => resolve({ stored, openedBrowser: true }));
      } catch (error) {
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("RingCentral authorization failed. Check the local terminal.");
        serverInstance.close();
        finish(() => reject(error));
      }
    });
    serverInstance.on("error", (error) => finish(() => reject(error)));
    serverInstance.listen(redirect.port, redirect.host, () => {
      const openedBrowser = openBrowser(authorizationUrl);
      if (!openedBrowser) console.log(`Open this URL locally to authorize:\n${authorizationUrl}`);
      else console.log("Opened RingCentral authorization in the local browser.");
    });
  });
}

function cryptoRandomState() {
  return crypto.randomBytes(24).toString("base64url");
}
