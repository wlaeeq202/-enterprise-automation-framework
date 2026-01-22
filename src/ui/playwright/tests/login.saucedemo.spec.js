// ------------------------------------------------------------
// PURPOSE:
// UI automation tests using Playwright with the Page Object Model.
// These tests validate core user flows:
// 1) Successful login
// 2) Product visibility
// 3) Adding an item to the cart
// 4) Run Locally npx playwright test src/ui/playwright/tests/login.saucedemo.spec.js
// ------------------------------------------------------------

const { test, expect } = require('@playwright/test');

// Page Objects encapsulating UI interactions
// This keeps tests readable and maintainable
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');

// Environment configuration (users, credentials, URLs, etc.)
const env = require('../config/env');

// ------------------------------------------------------------
// TEST: Valid user can login and see products
// ------------------------------------------------------------
test('Valid user can login and see products', async ({ page }) => {

  // Initialize Page Objects with the Playwright page
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // Navigate to the login page
  await loginPage.open();

  // Perform login using valid credentials from config
  // Credentials are externalized to avoid hardcoding
  await loginPage.login(
    env.users.valid.username,
    env.users.valid.password
  );

  // Verify that the inventory page has loaded successfully
  expect(await inventoryPage.isLoaded()).toBeTruthy();

  // Fetch all product names displayed on the page
  const names = await inventoryPage.getAllProductNames();

  // Validate that at least one product is visible
  expect(names.length).toBeGreaterThan(0);
});

// ------------------------------------------------------------
// TEST: User can add item to cart
// ------------------------------------------------------------
test('User can add item to cart', async ({ page }) => {

  // Initialize Page Objects
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // Navigate to login page
  await loginPage.open();

  // Login as a valid user
  await loginPage.login(
    env.users.valid.username,
    env.users.valid.password
  );

  // Add a specific product to the cart by name
  // This validates product interaction logic
  await inventoryPage.addProductToCartByName('Sauce Labs Backpack');

  // Verify that the cart count reflects the added item
  expect(await inventoryPage.getCartCount()).toBe(1);
});
