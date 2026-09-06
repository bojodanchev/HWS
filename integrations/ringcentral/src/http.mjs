export class RingCentralApiError extends Error {
  constructor(message, { status, statusText } = {}) {
    super(message);
    this.name = "RingCentralApiError";
    this.status = status;
    this.statusText = statusText;
  }
}

export function buildUrl(baseUrl, apiPath, query = {}) {
  if (typeof apiPath !== "string" || !apiPath.startsWith("/") || apiPath.startsWith("//")) {
    throw new Error("RingCentral API path must be a relative API path");
  }

  const base = new URL(baseUrl);
  const url = new URL(apiPath, base);
  if (url.origin !== base.origin) {
    throw new Error("RingCentral API path must stay on the configured endpoint");
  }

  const params = new URLSearchParams(url.search);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null && item !== "") params.append(key, String(item));
      }
    } else {
      params.set(key, String(value));
    }
  }
  url.search = params.toString();
  return url.toString();
}

export async function requestJson({
  baseUrl,
  apiPath,
  method = "GET",
  token,
  query,
  body,
  timeoutSeconds = 30,
  fetchImpl = globalThis.fetch,
}) {
  if (typeof fetchImpl !== "function") throw new Error("Fetch is not available in this Node runtime");
  if (typeof token !== "string" || token.length === 0) throw new Error("RingCentral access token is required");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutSeconds * 1000);
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    const init = { method, headers, signal: controller.signal };
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }

    const response = await fetchImpl(buildUrl(baseUrl, apiPath, query), init);
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text.slice(0, 200) };
      }
    }
    if (!response.ok) {
      throw new RingCentralApiError(`RingCentral API request failed with HTTP ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }
    return payload;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new RingCentralApiError(`RingCentral API request timed out after ${timeoutSeconds} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
