const BasePage = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);

    // Core page elements
    this.inventoryContainer = '.inventory_list';
    this.inventoryItem      = '.inventory_item';

    // Header / nav
    this.burgerMenu = '#react-burger-menu-btn';
    this.logoutLink = '#logout_sidebar_link';

    // Cart
    this.cartIcon   = '.shopping_cart_link';
    this.cartBadge  = '.shopping_cart_badge';
  }

  /**
   * Check that the inventory page has loaded
   * (used as a main assertion after login)
   */
  async isLoaded() {
    return await this.isVisible(this.inventoryContainer);
  }

  /**
   * Get list of all product names on the page
   * @returns {Promise<string[]>}
   */
  async getAllProductNames() {
    const nameLocator = this.page.locator(
      `${this.inventoryItem} .inventory_item_name`
    );
    return await nameLocator.allTextContents();
  }

  /**
   * Add a specific product to cart by its visible name
   * @param {string} productName
   */
  async addProductToCartByName(productName) {
    const product = this.page
      .locator(this.inventoryItem)
      .filter({ hasText: productName });

    await product
      .locator('button', { hasText: /add to cart/i })
      .click();
  }

  /**
   * Open the cart page
   */
  async openCart() {
    await this.click(this.cartIcon);
  }

  /**
   * Get the current cart item count
   * @returns {Promise<number>}
   */
  async getCartCount() {
    const isBadgeVisible = await this.isVisible(this.cartBadge);
    if (!isBadgeVisible) return 0;

    const text = await this.getText(this.cartBadge);
    return parseInt(text, 10) || 0;
  }

  /**
   * Log out via the burger menu
   */
  async logout() {
    await this.click(this.burgerMenu);
    await this.click(this.logoutLink);
  }
}

module.exports = InventoryPage;
