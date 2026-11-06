
const { test, expect } = require('../../fixtures/test');
const path = require('path');
const fs = require('node:fs/promises');

test('upload a single file @regression', async ({ page }) => {
  const htmlPath = path.resolve(__dirname, 'fixtures/upload.html');
  const filePath = path.resolve(__dirname, 'fixtures/sample.txt');

  await page.goto(`file://${htmlPath}`);

  const fileInput = page.locator('#document');

  await fileInput.setInputFiles(filePath);

  await expect(page.locator('#file-name')).toHaveText('sample.txt');

  const fileCount = await fileInput.evaluate(
    element => element.files.length
  );

  expect(fileCount).toBe(1);
});

test('upload multiple files @regression', async ({ page }) => {
  const htmlPath = path.resolve(__dirname, 'fixtures/upload.html');

  const file1 = path.resolve(__dirname, 'fixtures/sample.txt');
  const file2 = path.resolve(__dirname, 'fixtures/sample2.txt');

  await page.goto(`file://${htmlPath}`);

  const fileInput = page.locator('#document');

  await fileInput.setInputFiles([file1, file2]);

  await expect(page.locator('#file-name'))
    .toHaveText('sample.txt, sample2.txt');

  const fileCount = await fileInput.evaluate(
    element => element.files.length
  );

  expect(fileCount).toBe(2);
});

test('download and verify report content @regression', async ({ page }) => {
  const htmlPath = path.resolve(__dirname, 'fixtures/upload.html');

  await page.goto(`file://${htmlPath}`);

  const downloadPromise = page.waitForEvent('download');

  await page.getByRole('button', { name: 'Download Report' }).click();

  const download = await downloadPromise;

  const downloadPath = path.join(
    test.info().outputDir,
    download.suggestedFilename()
  );

  await download.saveAs(downloadPath);

  const content = await fs.readFile(downloadPath, 'utf-8');

  expect(download.suggestedFilename()).toBe('trade-report.csv');
  expect(content).toContain('TRD001,Executed');
  expect(content).toContain('TRD002,Pending');
});
