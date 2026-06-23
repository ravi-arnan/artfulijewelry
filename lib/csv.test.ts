import { test } from "node:test";
import assert from "node:assert/strict";
import { csvCell, toCsv } from "./csv.ts";

test("csvCell leaves simple values untouched", () => {
  assert.equal(csvCell("hello"), "hello");
  assert.equal(csvCell(42), "42");
  assert.equal(csvCell(null), "");
  assert.equal(csvCell(undefined), "");
});

test("csvCell quotes and escapes values with commas, quotes, or newlines", () => {
  assert.equal(csvCell("a,b"), '"a,b"');
  assert.equal(csvCell('she said "hi"'), '"she said ""hi"""');
  assert.equal(csvCell("line1\nline2"), '"line1\nline2"');
});

test("csvCell neutralizes formula-injection prefixes", () => {
  assert.equal(csvCell("=1+1"), "'=1+1");
  assert.equal(csvCell("+44 123"), "'+44 123");
  assert.equal(csvCell("-5"), "'-5");
  assert.equal(csvCell("@SUM(A1)"), "'@SUM(A1)");
});

test("csvCell still quotes a guarded value that also needs quoting", () => {
  // "=HYPERLINK(x,y)" gets the quote prefix AND contains a comma -> wrapped.
  assert.equal(csvCell("=HYPERLINK(a,b)"), '"\'=HYPERLINK(a,b)"');
});

test("toCsv builds a CRLF document with a header row", () => {
  const csv = toCsv(["name", "qty"], [["Bead", 10], ["Clasp", 5]]);
  assert.equal(csv, "name,qty\r\nBead,10\r\nClasp,5");
});

test("toCsv with no rows is just the header", () => {
  assert.equal(toCsv(["a", "b"], []), "a,b");
});
