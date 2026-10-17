// Pure CSV serialization helpers. No IO, so they unit-test cleanly.

// CSV / formula injection guard: a spreadsheet treats a cell beginning with
// = + - @ (or a leading tab/CR) as a formula, which can exfiltrate data or run
// commands when the export is opened. Prefix such values with a single quote so
// they render as literal text. See OWASP "CSV Injection".
function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

// Renders one value as a CSV field: formula-guarded, and quoted (with doubled
// internal quotes) when it contains a comma, quote, or newline.
export function csvCell(value: unknown): string {
  const raw = value == null ? "" : String(value);
  const guarded = neutralizeFormula(raw);
  if (/[",\n\r]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

// Joins a header row and data rows into a CRLF-delimited CSV document (CRLF is
// the RFC 4180 line ending and the most spreadsheet-compatible).
export function toCsv(headers: string[], rows: readonly unknown[][]): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(row.map(csvCell).join(","));
  return lines.join("\r\n");
}
