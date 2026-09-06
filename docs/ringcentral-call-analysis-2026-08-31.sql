-- Provenance contract for the RingCentral analysis dated 2026-08-31.
-- The underlying extraction is an authenticated RingCentral Platform API call,
-- not a warehouse query. The SELECT below is a portable, runnable declaration
-- of the bounded extraction window; endpoint, filters and metric definitions
-- are recorded in the report source metadata.
SELECT
  'RingCentral account call log' AS source,
  '2026-01-01T00:00:00Z' AS date_from,
  'GET /restapi/v1.0/account/~/call-log' AS endpoint,
  1547 AS reviewed_rows;

-- The extension inventory was read from:
-- GET /restapi/v1.0/account/~/extension
SELECT
  'RingCentral extension inventory' AS source,
  'GET /restapi/v1.0/account/~/extension' AS endpoint,
  33 AS reviewed_rows;
