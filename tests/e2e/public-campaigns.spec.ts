import { test, expect, type Browser, type Page } from '@playwright/test'

const testEmail = () => `test-${Date.now()}@playwright.test`

async function registerAndPublishCampaign(
  page: Page,
  title: string,
  description: string,
  discipline = 'Triathlon'
) {
  await page.goto('/register')
  await page.getByRole('button', { name: 'Brand' }).click()
  await page.getByLabel('Email address').fill(testEmail())
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.waitForURL('/onboarding')
  await page.getByLabel('Brand name').fill('Test Brand')
  await page.getByRole('checkbox', { name: discipline }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('/dashboard')

  await page.goto('/dashboard/campaigns/new')
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Description').fill(description)
  await page.getByRole('checkbox', { name: discipline }).click()
  await page.getByRole('button', { name: 'Create Campaign' }).click()
  await page.waitForURL('/dashboard/campaigns')

  await page.getByRole('link', { name: 'Preview' }).click()
  await page.getByRole('button', { name: 'Publish' }).click()
  await page.waitForURL('/dashboard/campaigns')
}

async function setupPublishedCampaign(browser: Browser) {
  const page = await browser.newPage()
  await registerAndPublishCampaign(
    page,
    'E2E Campaign',
    'Full description of the E2E campaign.',
    'Triathlon'
  )
  await page.close()
}

test('shows empty state when no active campaigns exist', async ({ page }) => {
  await page.goto('/campaigns')
  await expect(page.getByText('No active campaigns at the moment.')).toBeVisible()
})

test.describe('Public campaigns page - with active campaign', () => {
  test.beforeAll(async ({ browser }) => {
    await setupPublishedCampaign(browser)
  })

  test('shows active campaign in the list', async ({ page }) => {
    await page.goto('/campaigns')
    await expect(page.getByText('E2E Campaign')).toBeVisible()
  })

  test('shows brand name on campaign card', async ({ page }) => {
    await page.goto('/campaigns')
    await expect(page.getByText('Test Brand').first()).toBeVisible()
  })

  test('shows discipline badges on campaign card', async ({ page }) => {
    await page.goto('/campaigns')
    await expect(page.getByText('Triathlon').first()).toBeVisible()
  })

  test('See details button links to campaign detail page', async ({ page }) => {
    await page.goto('/campaigns')
    await page.getByRole('link', { name: 'See details' }).first().click()
    await expect(page.getByRole('heading', { name: 'E2E Campaign' })).toBeVisible()
  })
})

test.describe('Public campaign detail page', () => {
  test.beforeAll(async ({ browser }) => {
    await setupPublishedCampaign(browser)
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('/campaigns')
    await page.getByRole('link', { name: 'See details' }).first().click()
  })

  test('displays campaign title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'E2E Campaign' })).toBeVisible()
  })

  test('displays brand name', async ({ page }) => {
    await expect(page.getByText('Test Brand').first()).toBeVisible()
  })

  test('displays full description', async ({ page }) => {
    await expect(page.getByText('Full description of the E2E campaign.')).toBeVisible()
  })

  test('Back to Campaigns link navigates to list', async ({ page }) => {
    await page.getByRole('link', { name: /back to campaigns/i }).click()
    await expect(page).toHaveURL('/campaigns')
  })
})
