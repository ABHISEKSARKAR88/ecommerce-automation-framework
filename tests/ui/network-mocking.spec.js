/*
What have we achieved?
Method	Purpose	Practiced
route.abort()	Simulate network failure	
route.continue()	Forward original request	
route.continue({ headers })	Modify request headers	
route.continue({ postData })	Modify request body	
route.fulfill()	Mock API responses	

Important SDET distinction: Your latest test verifies that the browser receives a mocked response. It doesn't create a real order or verify the SauceDemo application's UI.

*/

const { test, expect } = require('../../fixtures/test');

test('intercepts an API request and returns a mocked 500 response', async ({
  standardUserPage,
}) => {
  await standardUserPage.goto('/inventory.html');

  await standardUserPage.route('**/api/test-products', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Internal Server Error',
      }),
    });
  });

  const response = await standardUserPage.evaluate(async () => {
    const result = await fetch('/api/test-products');

    return {
      status: result.status,
      body: await result.json(),
    };
  });

  expect(response.status).toBe(500);
  expect(response.body.error).toBe('Internal Server Error');
});


test('abort an image request @regression', async ({ standardUserPage }) => {
  await standardUserPage.route('**/*.jpg', route => route.abort());

  await standardUserPage.goto('/inventory.html');

  const brokenImages = standardUserPage.locator(
    '.inventory_item_img img'
  );

  await expect(brokenImages.first()).toHaveJSProperty('naturalWidth', 0);
});

test('intercept and continue a request @regression', async ({ standardUserPage }) => {
  await standardUserPage.route('**/inventory.html', async route => {
    console.log('Intercepted:', route.request().url());

    await route.continue();
  });

  await standardUserPage.goto('/inventory.html');

  await expect(standardUserPage).toHaveURL(/inventory\.html/);
});

test('modify and verify request headers @regression', async ({ standardUserPage }) => {
  await standardUserPage.goto('/inventory.html');

  await standardUserPage.route('**/api/test-headers', async route => {
    const headers = {
      ...route.request().headers(),
      'x-test-environment': 'qa',
    };

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        receivedHeader: headers['x-test-environment'],
      }),
    });
  });

  const response = await standardUserPage.evaluate(async () => {
    const result = await fetch('/api/test-headers');

    return {
      status: result.status,
      body: await result.json(),
    };
  });

  expect(response.status).toBe(200);
  expect(response.body.receivedHeader).toBe('qa');
});

test('modify POST request body @regression', async ({ standardUserPage }) => {
  await standardUserPage.goto('/inventory.html');

  await standardUserPage.route('**/api/test-orders', async route => {
    const originalBody = route.request().postDataJSON();

    const modifiedBody = {
      ...originalBody,
      role: 'admin',
    };

    expect(originalBody.role).toBe('user');
    expect(modifiedBody.role).toBe('admin');

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        receivedPayload: modifiedBody,
      }),
    });
  });

  const response = await standardUserPage.evaluate(async () => {
    const result = await fetch('/api/test-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'standard_user',
        role: 'user',
      }),
    });

    return {
      status: result.status,
      body: await result.json(),
    };
  });

  expect(response.status).toBe(201);
  expect(response.body.receivedPayload.username).toBe('standard_user');
  expect(response.body.receivedPayload.role).toBe('admin');
});

test('mock a successful POST response @regression', async ({ standardUserPage }) => {
  await standardUserPage.goto('/inventory.html');

  await standardUserPage.route('**/api/test-orders', async route => {
    const requestBody = route.request().postDataJSON();

    console.log('Received request:', requestBody);

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Order created successfully',
        orderId: 'ORD-101',
        role: requestBody.role,
      }),
    });
  });

  const response = await standardUserPage.evaluate(async () => {
    const result = await fetch('/api/test-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'standard_user',
        role: 'user',
      }),
    });

    return {
      status: result.status,
      body: await result.json(),
    };
  });

  console.log('Mocked response:', response);

  expect(response.status).toBe(201);
  expect(response.body.orderId).toBe('ORD-101');
  expect(response.body.message).toBe('Order created successfully');
});

