export const separateVoiceAssistantPlan = {
  name: "SBI Voice Assistant",
  status: "configured_not_connected",
  snapshotDate: "2026-09-06",
  note: "Dated local metadata, not a live provider status query.",
  extensionNumber: "1007",
  providerName: "SBI HWS Treatment",
  evidence: "evals/ringcentral-air-configuration-receipt-2026-09-06.md",
  telephonySurface: "RingCentral",
  separateFromExistingAgent: true,
  phases: [
    "confirm the pilot number, routing hours and lead/voicemail owner with Alex-Shon",
    "review and approve the exact isolated number or IVR cohort",
    "verify actual inbound calls, handoffs, audio and recording/transcript storage",
    "activate the reviewed pilot while preserving Lucy as control",
    "evaluate comparable call evidence before any main-route promotion",
  ],
};
