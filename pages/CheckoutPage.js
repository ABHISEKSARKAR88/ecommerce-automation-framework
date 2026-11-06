
const { expect } = require('@playwright/test');
class CheckoutPage {
  constructor(page) {
    this.page = page;

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.errorMessage = page.locator('[data-test="error"]');

    this.continueButton = page.getByRole('button', {
      name: 'Continue',
    });

    this.finishButton = page.getByRole('button', {
      name: 'Finish',
    });

    this.cancelButton = page.getByRole('button', {
      name: 'Cancel',
    });

    this.checkoutTitle = page.locator('.title');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');

    this.completeHeader = page.locator('.complete-header');
  }

  async fillCustomerInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async getSubtotal() {
    const text = await this.subtotalLabel.textContent();
    return Number(text.replace('Item total: $', ''));
  }

  async getTax() {
    const text = await this.taxLabel.textContent();
    return Number(text.replace('Tax: $', ''));
  }

  async getTotal() {
    const text = await this.totalLabel.textContent();
    return Number(text.replace('Total: $', ''));
  }

  async expectOrderComplete() {
  await expect(this.completeHeader).toHaveText(
    'Thank you for your order!'
  );
}
}

module.exports = { CheckoutPage };

