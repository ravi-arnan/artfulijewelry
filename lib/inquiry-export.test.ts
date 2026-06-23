import { test } from "node:test";
import assert from "node:assert/strict";
import { inquiriesToCsv, type ExportInquiry } from "./inquiry-export.ts";

const ONE: ExportInquiry = {
  id: "inq-1",
  created_at: "2026-06-24T10:00:00Z",
  name: "Maya Lestari",
  email: "maya@example.com",
  company: "Ubud Silver",
  message: "Restock please",
  status: "new",
  inquiry_items: [
    { name: "Round Bead", material: "925 Silver", quantity: 200, price_from: 1.4, min_order: 50 },
    { name: "Toggle Clasp", material: "925 Silver", quantity: 60, price_from: "2.10", min_order: 20 },
  ],
};

test("inquiriesToCsv emits a header plus one row per line item", () => {
  const csv = inquiriesToCsv([ONE]);
  const lines = csv.split("\r\n");
  assert.equal(lines.length, 3); // header + 2 items
  assert.match(lines[0], /^inquiry_id,created_at,status,customer,email,company,message,item,material,quantity,price_from,min_order,line_estimate$/);
});

test("inquiriesToCsv repeats lead fields and computes line_estimate", () => {
  const [, row1, row2] = inquiriesToCsv([ONE]).split("\r\n");
  assert.match(row1, /inq-1,2026-06-24T10:00:00Z,new,Maya Lestari,maya@example.com,Ubud Silver,Restock please,Round Bead,925 Silver,200,1.4,50,280.00/);
  // string price "2.10" coerced to number, 60 * 2.10 = 126.00
  assert.match(row2, /Toggle Clasp,925 Silver,60,2.1,20,126.00/);
});

test("inquiriesToCsv emits one lead row with blank item columns when there are no items", () => {
  const csv = inquiriesToCsv([{ ...ONE, inquiry_items: [] }]);
  const lines = csv.split("\r\n");
  assert.equal(lines.length, 2);
  assert.ok(lines[1].endsWith(",,,,,,")); // 6 trailing blank item columns
});

test("inquiriesToCsv leaves price_from and line_estimate blank when price is null", () => {
  const csv = inquiriesToCsv([
    { ...ONE, inquiry_items: [{ name: "X", material: null, quantity: 3, price_from: null, min_order: null }] },
  ]);
  const row = csv.split("\r\n")[1];
  assert.match(row, /X,,3,,,$/); // material blank, qty 3, price blank, min_order blank, estimate blank
});

test("inquiriesToCsv with an empty list is just the header", () => {
  assert.ok(inquiriesToCsv([]).startsWith("inquiry_id,created_at,status"));
  assert.equal(inquiriesToCsv([]).includes("\r\n"), false);
});
