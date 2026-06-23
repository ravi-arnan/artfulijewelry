import { test, expect } from "@playwright/test";

test("homepage loads with hero and title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Bali Handmade/);
  await expect(page.locator("h1")).toBeVisible();
});

test("shop lists products and filters by category with subcategories", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: /shop the collection/i })).toBeVisible();

  await page.getByRole("link", { name: /^Beads \(/ }).first().click();
  await expect(page).toHaveURL(/category=beads/);

  // The "Type" subcategory group only appears once a category is selected.
  await expect(page.getByText("Type", { exact: true })).toBeVisible();
});

test("restocked status renders its collection heading", async ({ page }) => {
  await page.goto("/shop?status=restocked");
  await expect(page.getByRole("heading", { name: /^restocked$/i })).toBeVisible();
});

test("product page renders a breadcrumb", async ({ page }) => {
  await page.goto("/shop/B0117X65");
  await expect(page.getByRole("navigation", { name: /breadcrumb/i })).toBeVisible();
});

test("login page offers Google and email sign-in", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /forgot password/i })).toBeVisible();
});

test("account redirects to login when signed out", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login\?next=\/account/);
});

test("services landing links to a service detail page", async ({ page }) => {
  await page.goto("/services");
  await page.getByRole("link", { name: /laser engraving/i }).first().click();
  await expect(page).toHaveURL(/\/services\/laser-engraving/);
  await expect(page.getByRole("heading", { name: /laser engraving/i })).toBeVisible();
});
