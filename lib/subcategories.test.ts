import { test } from "node:test";
import assert from "node:assert/strict";
import { deriveSubcategory, getSubcategories } from "./subcategories.ts";

test("deriveSubcategory matches a keyword in the name", () => {
  assert.equal(deriveSubcategory("beads", "Round Silver Beads"), "round");
  assert.equal(deriveSubcategory("beads", "Filigree Beads"), "filigree");
  assert.equal(deriveSubcategory("charms", "Fancy Alphabet Charms"), "alphabet");
  assert.equal(deriveSubcategory("mountings", "Bezel Silver Mountings"), "bezel");
});

test("deriveSubcategory returns undefined when nothing matches", () => {
  assert.equal(deriveSubcategory("beads", "Mystery Object"), undefined);
});

test("deriveSubcategory returns undefined for unknown categories", () => {
  assert.equal(deriveSubcategory("nonexistent", "Round Beads"), undefined);
});

test("getSubcategories is empty for null or unknown category", () => {
  assert.deepEqual(getSubcategories(null), []);
  assert.deepEqual(getSubcategories("nonexistent"), []);
  assert.ok(getSubcategories("beads").length > 0);
});
