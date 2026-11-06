
const { test, expect } = require('../../fixtures/test');
const { products } = require('../../test-data/testData');

test.describe('Inventory functionality', () => {
  test('products page displays product names and prices @smoke', async ({
    standardUserPage,
    authenticatedInventoryPage,
  }) => {
    await standardUserPage.goto('/inventory.html');
    await expect(standardUserPage).toHaveURL(/inventory\.html/);
    await authenticatedInventoryPage.expectLoaded();

    await expect(authenticatedInventoryPage.inventoryItems).toHaveCount(6);
    await expect(authenticatedInventoryPage.productNames).toHaveCount(6);
    await expect(authenticatedInventoryPage.productPrices).toHaveCount(6);

    const names = await authenticatedInventoryPage.getProductNames();
    const prices = await authenticatedInventoryPage.getProductPrices();

    expect(names.every((name) => name.trim().length > 0)).toBe(true);
    expect(prices.every((price) => /^\$\d+\.\d{2}$/.test(price))).toBe(true);
  });

  test('products can be sorted by name A to Z @regression', async ({
    standardUserPage,
    authenticatedInventoryPage,
  }) => {
    await standardUserPage.goto('/inventory.html');
    await authenticatedInventoryPage.expectLoaded();

    await authenticatedInventoryPage.sortBy('az');

    const actualNames = await authenticatedInventoryPage.getProductNames();

    const expectedNames = [
      products.backpack,
      products.bikeLight,
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ];

    expect(actualNames).toEqual(expectedNames);
  });

  test('products can be sorted by price low to high @regression', async ({
    standardUserPage,
    authenticatedInventoryPage,
  }) => {
    await standardUserPage.goto('/inventory.html');
    await authenticatedInventoryPage.expectLoaded();

    await authenticatedInventoryPage.sortBy('lohi');

    const actualPrices =
      await authenticatedInventoryPage.getSortedPricesAsNumbers();

    const expectedPrices = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];

    expect(actualPrices).toEqual(expectedPrices);
  });

  test('user can add a product to the cart @smoke', async ({
    standardUserPage,
    authenticatedInventoryPage,
  }) => {
    await standardUserPage.goto('/inventory.html');
    await authenticatedInventoryPage.expectLoaded();

    await authenticatedInventoryPage.addProductToCart(products.backpack);

    await expect(
      standardUserPage.locator('.shopping_cart_badge')
    ).toHaveText('1');

    expect(await authenticatedInventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('user can remove a product from the inventory cart @regression', async ({
    standardUserPage,
    authenticatedInventoryPage,
  }) => {
    await standardUserPage.goto('/inventory.html');
    await authenticatedInventoryPage.expectLoaded();

    await authenticatedInventoryPage.addProductToCart(products.backpack);

    expect(await authenticatedInventoryPage.getCartBadgeCount()).toBe(1);

    await authenticatedInventoryPage.removeProductFromCart(products.backpack);

    expect(await authenticatedInventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('user can add multiple products to the cart @regression', async ({
    standardUserPage,
    authenticatedInventoryPage,
  }) => {
    await standardUserPage.goto('/inventory.html');
    await authenticatedInventoryPage.expectLoaded();

    await authenticatedInventoryPage.addProductToCart(products.backpack);
    await authenticatedInventoryPage.addProductToCart(products.bikeLight);

    expect(await authenticatedInventoryPage.getCartBadgeCount()).toBe(2);
  });

  test('user can remove a product from the cart page @regression', async ({
    standardUserPage,
    authenticatedInventoryPage,
    authenticatedCartPage,
  }) => {
    await standardUserPage.goto('/inventory.html');
    await authenticatedInventoryPage.expectLoaded();

    await authenticatedInventoryPage.addProductToCart(products.backpack);

    await authenticatedInventoryPage.openCart();
    await authenticatedCartPage.expectLoaded();

    await expect(authenticatedCartPage.cartItems).toHaveCount(1);

    await authenticatedCartPage.removeProduct(products.backpack);

    await expect(authenticatedCartPage.cartItems).toHaveCount(0);
  });


test('monitor network requests and responses @regression', async ({
  standardUserPage,
}) => {
  standardUserPage.on('request', request => {
    console.log('REQUEST:', request.method(), request.url());
  });

  standardUserPage.on('response', response => {
    console.log('RESPONSE:', response.status(), response.url());
  });

  await standardUserPage.goto('/inventory.html');
});


test('wait for inventory page response @regression', async ({
  standardUserPage,
}) => {
  const responsePromise = standardUserPage.waitForResponse(response =>
    response.url().includes('/inventory.html') &&
    response.status() === 200
  );

  await standardUserPage.goto('/inventory.html');

  const response = await responsePromise;

  expect(response.status()).toBe(200);
});

});
