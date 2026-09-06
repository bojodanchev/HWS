-- Provenance contract for the user-authenticated RingCentral Admin Portal
-- follow-up dated 2026-08-31. The underlying source is a browser UI, not a
-- warehouse query; this declaration keeps the bounded reviewed totals
-- inspectable without copying caller PII.
SELECT
  'RingCentral AIR Call history' AS source,
  'Last 30/60/90 day custom windows' AS date_range,
  18 AS call_history_rows_30d_original,
  25 AS call_history_rows_60d,
  32 AS call_history_rows_90d,
  16 AS analytics_calls_handled_30d_original,
  21 AS analytics_calls_handled_60d,
  28 AS analytics_calls_handled_90d,
  7 AS resolved_calls_30d_original,
  9 AS resolved_calls_60d,
  12 AS resolved_calls_90d,
  9 AS unresolved_calls_60d,
  16 AS unresolved_calls_90d;

SELECT
  'RingCentral AIR Studio inventory' AS source,
  5 AS ai_receptionists,
  1 AS connected_receptionist,
  4 AS not_connected_receptionists,
  1 AS treatment_receptionist_created,
  4 AS lead_responses_60d,
  10 AS lead_responses_90d;
