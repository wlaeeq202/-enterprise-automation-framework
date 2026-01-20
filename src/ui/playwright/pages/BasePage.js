// src/ui/playwright/pages/BasePage.js

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async click(locator) {
    await this.page.click(locator);
  }

  async type(locator, text) {
    await this.page.fill(locator, text);
  }

  async getText(locator) {
    return await this.page.textContent(locator);
  }

  async isVisible(locator) {
    return await this.page.isVisible(locator);
  }
}

// IMPORTANT: export the class directly, not as { BasePage: ... }
module.exports = BasePage;
