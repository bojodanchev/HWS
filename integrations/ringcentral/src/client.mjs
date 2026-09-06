import { getAccessToken } from "./auth.mjs";
import { requestJson } from "./http.mjs";
import { assertWriteAllowed } from "./write-policy.mjs";

function requiredId(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} is required`);
  }
  return value.trim();
}

function pageQuery(options = {}) {
  const query = {};
  if (options.recordCount !== undefined) query.recordCount = options.recordCount;
  if (options.pageToken !== undefined) query.pageToken = options.pageToken;
  return query;
}

export class RingCentralClient {
  constructor({ config, env = process.env, fetchImpl = globalThis.fetch } = {}) {
    if (!config?.endpoint) throw new Error("A normalized RingCentral config is required");
    this.config = config;
    this.env = env;
    this.fetchImpl = fetchImpl;
  }

  async request(apiPath, options = {}) {
    const token = await getAccessToken({
      server: this.config.endpoint,
      env: this.env,
      fetchImpl: this.fetchImpl,
    });
    return requestJson({
      baseUrl: this.config.endpoint,
      apiPath,
      token,
      timeoutSeconds: this.config.timeout,
      fetchImpl: this.fetchImpl,
      ...options,
    });
  }

  getAccount() {
    return this.request("/restapi/v1.0/account/~");
  }

  getExtension() {
    return this.request("/restapi/v1.0/account/~/extension/~");
  }

  listExtensions(options = {}) {
    const query = {
      type: options.type,
      status: options.status,
      perPage: options.perPage,
      page: options.page,
    };
    return this.request("/restapi/v1.0/account/~/extension", { query });
  }

  listChats(options = {}) {
    return this.request("/team-messaging/v1/chats", { query: pageQuery(options) });
  }

  listPosts(chatId, options = {}) {
    const id = encodeURIComponent(requiredId(chatId, "chatId"));
    return this.request(`/team-messaging/v1/chats/${id}/posts`, {
      query: pageQuery(options),
    });
  }

  listMessageStore(options = {}) {
    const query = {
      dateFrom: options.dateFrom,
      dateTo: options.dateTo,
      messageType: options.messageType,
      direction: options.direction,
      readStatus: options.readStatus,
      perPage: options.perPage,
      page: options.page,
    };
    return this.request("/restapi/v1.0/account/~/extension/~/message-store", { query });
  }

  listCallLog(options = {}) {
    const query = {
      dateFrom: options.dateFrom,
      dateTo: options.dateTo,
      type: options.type,
      direction: options.direction,
      perPage: options.perPage,
      page: options.page,
    };
    return this.request("/restapi/v1.0/account/~/extension/~/call-log", { query });
  }

  listAccountCallLog(options = {}) {
    const query = {
      dateFrom: options.dateFrom,
      dateTo: options.dateTo,
      type: options.type,
      direction: options.direction,
      perPage: options.perPage,
      page: options.page,
    };
    return this.request("/restapi/v1.0/account/~/call-log", { query });
  }

  postChatMessage(chatId, text, { confirmed = false } = {}) {
    const id = requiredId(chatId, "chatId");
    if (typeof text !== "string" || text.trim().length === 0) {
      throw new Error("text is required");
    }
    assertWriteAllowed(this.config, {
      operation: "post-chat-message",
      chatId: id,
      confirmed,
    });
    return this.request(`/team-messaging/v1/chats/${encodeURIComponent(id)}/posts`, {
      method: "POST",
      body: { text },
    });
  }
}
