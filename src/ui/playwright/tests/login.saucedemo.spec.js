const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const env = require('../config/env');

test('Valid user can login and see products', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login(env.users.valid.username, env.users.valid.password);

  expect(await inventoryPage.isLoaded()).toBeTruthy();

  const names = await inventoryPage.getAllProductNames();
  expect(names.length).toBeGreaterThan(0);
});

test('User can add item to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login(env.users.valid.username, env.users.valid.password);

  await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
  expect(await inventoryPage.getCartCount()).toBe(1);
});
