# HWS ElevenLabs pilot

`hws-pilot.json` is the reviewed agent configuration; `resource-ids.json` identifies only this HWS agent, knowledge document and UK number. The public catalogue knowledge file deliberately excludes supplier costs and discounts.

The inbound number is +442045774094. The owner configured its Zadarma External Server route to `+442045774094@sip.rtc.elevenlabs.io:5060;transport=tcp` and confirmed a working call. `call-verification.json` retains minimal provider evidence, without caller number or transcript.

Do not change the shared Zadarma SIP account or another agent's number. There is no outbound calling configuration. RingCentral remains separate.

Use the official API with `ELEVENLABS_API_KEY` supplied by the environment. Never print or commit credentials. The installed CLI may have an OAuth credential as well; combining it with an inherited API key can produce a dual-auth 401. Use one authentication mode only.

The synthetic simulation JSON files contain pre-knowledge and post-knowledge scenarios. `simulation-grounded-price.json` is the successful grounded-price check. The original compatibility result is retained as a regression example; `simulation-compatibility-retest.json` is the corrected result.

Lead/contact extraction stays in ElevenLabs. External delivery and human transfers require exact destinations before configuration. Do not claim a callback was scheduled or a transfer completed without a connected tool and verified result.
