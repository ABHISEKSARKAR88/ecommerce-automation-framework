
const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;

    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');

    this.continueShoppingButton = page.getByRole('button', {
      name: 'Continue Shopping',
    });

    this.checkoutButton = page.getByRole('button', {
      name: 'Checkout',
    });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await expect(this.cartItems.first()).toBeVisible();
  }

  async getProductNames() {
    return await this.cartItemNames.allTextContents();
  }

  async removeProduct(productName) {
    const cartItem = this.cartItems.filter({
      has: this.page.getByText(productName, { exact: true }),
    });

    await expect(cartItem).toBeVisible();

    await cartItem.getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
