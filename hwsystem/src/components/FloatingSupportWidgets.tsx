"use client";

import { useState } from "react";
import { ContactCapturePopup } from "@/components/ContactCapturePopup";
import { CustomerAssistant } from "@/components/CustomerAssistant";

/** Keep the two conversion-focused floating controls mutually exclusive. */
export function FloatingSupportWidgets() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <>
      <CustomerAssistant onOpenChange={setAssistantOpen} />
      {!assistantOpen && <ContactCapturePopup />}
    </>
  );
}
