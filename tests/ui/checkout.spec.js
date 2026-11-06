
const { test, expect } = require('../../fixtures/test');
const { customer, products } = require('../../test-data/testData');

async function openCheckoutInformation({
  standardUserPage,
  authenticatedInventoryPage,
  authenticatedCartPage,
}) {
  await standardUserPage.goto('/inventory.html');
  await authenticatedInventoryPage.expectLoaded();

  await authenticatedInventoryPage.addProductToCart(products.backpack);

  await authenticatedInventoryPage.openCart();
  await authenticatedCartPage.expectLoaded();

  await authenticatedCartPage.checkout();
}

test.describe('Checkout functionality', () => {
  test('user can proceed to checkout overview @smoke', async ({
    standardUserPage,
    authenticatedInventoryPage,
    authenticatedCartPage,
    authenticatedCheckoutPage,
  }) => {
    await openCheckoutInformation({
      standardUserPage,
      authenticatedInventoryPage,
      authenticatedCartPage,
    });

    await expect(standardUserPage).toHaveURL(
      /checkout-step-one\.html/
    );

    await authenticatedCheckoutPage.fillCustomerInformation(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );

    await authenticatedCheckoutPage.continueToOverview();

    await expect(standardUserPage).toHaveURL(
      /checkout-step-two\.html/
    );

    await expect(standardUserPage.locator('.cart_item')).toHaveCount(1);

    await expect(
      standardUserPage.locator('.inventory_item_name')
    ).toHaveText(products.backpack);

    const subtotal = await authenticatedCheckoutPage.getSubtotal();
    const tax = await authenticatedCheckoutPage.getTax();
    const total = await authenticatedCheckoutPage.getTotal();

    expect(subtotal).toBe(29.99);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('user can complete an order @smoke', async ({
    standardUserPage,
    authenticatedInventoryPage,
    authenticatedCartPage,
    authenticatedCheckoutPage,
  }) => {
    await openCheckoutInformation({
      standardUserPage,
      authenticatedInventoryPage,
      authenticatedCartPage,
    });

    await authenticatedCheckoutPage.fillCustomerInformation(
      customer.firstName,
      customer.lastName,
      customer.postalCode
    );

    await authenticatedCheckoutPage.continueToOverview();
    await authenticatedCheckoutPage.finishOrder();

    await expect(standardUserPage).toHaveURL(
      /checkout-complete\.html/
    );

    await authenticatedCheckoutPage.expectOrderComplete();
  });

  test('checkout requires a first name @regression', async ({
    standardUserPage,
    authenticatedInventoryPage,
    authenticatedCartPage,
    authenticatedCheckoutPage,
  }) => {
    await openCheckoutInformation({
      standardUserPage,
      authenticatedInventoryPage,
      authenticatedCartPage,
    });

    await authenticatedCheckoutPage.fillCustomerInformation(
      '',
      customer.lastName,
      customer.postalCode
    );

    await authenticatedCheckoutPage.continueToOverview();

    await expect(authenticatedCheckoutPage.errorMessage).toBeVisible();
    await expect(authenticatedCheckoutPage.errorMessage).toContainText(
      'First Name is required'
    );
  });

  test('checkout requires a last name @regression', async ({
    standardUserPage,
    authenticatedInventoryPage,
    authenticatedCartPage,
    authenticatedCheckoutPage,
  }) => {
    await openCheckoutInformation({
      standardUserPage,
      authenticatedInventoryPage,
      authenticatedCartPage,
    });

    await authenticatedCheckoutPage.fillCustomerInformation(
      customer.firstName,
      '',
      customer.postalCode
    );

    await authenticatedCheckoutPage.continueToOverview();

    await expect(authenticatedCheckoutPage.errorMessage).toBeVisible();
    await expect(authenticatedCheckoutPage.errorMessage).toContainText(
      'Last Name is required'
    );
  });

  test('checkout requires a postal code @regression', async ({
    standardUserPage,
    authenticatedInventoryPage,
    authenticatedCartPage,
    authenticatedCheckoutPage,
  }) => {
    await openCheckoutInformation({
      standardUserPage,
      authenticatedInventoryPage,
      authenticatedCartPage,
    });

    await authenticatedCheckoutPage.fillCustomerInformation(
      customer.firstName,
      customer.lastName,
      ''
    );

    await authenticatedCheckoutPage.continueToOverview();

    await expect(authenticatedCheckoutPage.errorMessage).toBeVisible();
    await expect(authenticatedCheckoutPage.errorMessage).toContainText(
      'Postal Code is required'
    );
  });
});
