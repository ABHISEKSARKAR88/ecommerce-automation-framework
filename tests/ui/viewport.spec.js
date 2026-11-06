
const { test, expect } = require('../../fixtures/test');

test('verify browser viewport dimensions @regression', async ({ page }, testInfo) => {
  const viewport = page.viewportSize();

  console.log(`${testInfo.project.name} viewport:`, viewport);

  expect(viewport).not.toBeNull();

  if (testInfo.project.name === 'webkit') {
    expect(viewport.width).toBe(1440);
    expect(viewport.height).toBe(900);
  } else {
    expect(viewport.width).toBe(1280);
    expect(viewport.height).toBe(720);
  }
});
