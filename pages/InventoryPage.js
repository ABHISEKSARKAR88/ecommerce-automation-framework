const { expect } = require('@playwright/test');
class InventoryPage {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.getByText('Products', { exact: true });
    this.inventoryItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async expectLoaded() {
  await expect(this.pageTitle).toBeVisible();
}

  async getProductNames() {
    return await this.productNames.allTextContents();
  }

  async getProductPrices() {
    return await this.productPrices.allTextContents();
  }

  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  async getSortedPricesAsNumbers() {
  const prices = await this.getProductPrices();

  return prices.map((price) =>
    Number(price.replace('$', ''))
  );
 }

  async addProductToCart(productName) {
  const product = this.inventoryItems.filter({
    has: this.page.getByText(productName, { exact: true }),
  });

  await product.getByRole('button', { name: 'Add to cart' }).click();
 }

  async getCartBadgeCount() {
  const badge = this.page.locator('.shopping_cart_badge');

  if (await badge.count() === 0) {
    return 0;
  }

  return Number(await badge.textContent());
 }

  async openCart() {
    await this.cartLink.click();
  }

  async removeProductFromCart(productName) {
  const product = this.inventoryItems.filter({
  has: this.page.getByText(productName, { exact: true }),
  });


  await product.getByRole('button', { name: 'Remove' }).click();
  }

}

module.exports = { InventoryPage };
