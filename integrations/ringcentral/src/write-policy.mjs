export function assertWriteAllowed(config, { operation, chatId, confirmed } = {}) {
  if (!config?.writeEnabled) {
    throw new Error("RingCentral writes are disabled; set write_enabled and RINGCENTRAL_WRITE_ENABLED=true");
  }
  if (config.requireWriteConfirmation !== false && confirmed !== true) {
    throw new Error(`Write operation ${operation ?? "unknown"} requires --confirm-write`);
  }
  if (typeof chatId !== "string" || !chatId.trim()) {
    throw new Error("A target chat ID is required for RingCentral write operations");
  }
  if (!config.allowlistedChatIds.includes(chatId)) {
    throw new Error(`Target chat ${chatId} is not in the RingCentral write allowlist`);
  }
  return true;
}
