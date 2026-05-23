import { test, expect, type Page } from '@playwright/test'

const testEmail = () => `test-${Date.now()}@playwright.test`

async function registerBrand(page: Page) {
  await page.goto('/register')
  await page.getByRole('button', { name: 'Brand' }).click()
  await page.getByLabel('Email address').fill(testEmail())
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.waitForURL('/onboarding')
  await page.getByLabel('Brand name').fill('Test Brand')
  await page.getByRole('checkbox', { name: 'Crossfit' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('/dashboard')
}

async function createCampaign(page: Page, title: string, description: string, discipline = 'Crossfit') {
  await page.goto('/dashboard/campaigns/new')
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Description').fill(description)
  await page.getByRole('checkbox', { name: discipline }).click()
  await page.getByRole('button', { name: 'Create Campaign' }).click()
  await page.waitForURL('/dashboard/campaigns')
}

test.describe('Campaign list', () => {
  test.beforeEach(async ({ page }) => {
    await registerBrand(page)
    await page.goto('/dashboard/campaigns')
  })

  test('displays empty state when no campaigns exist', async ({ page }) => {
    await expect(page.getByText('No campaigns yet.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create your first campaign →' })).toBeVisible()
  })

  test('displays New Campaign button', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'New Campaign' })).toBeVisible()
  })

  test('shows created campaign in the list', async ({ page }) => {
    await createCampaign(page, 'My First Campaign', 'A great campaign description.')
    await expect(page.getByText('My First Campaign')).toBeVisible()
  })

  test('new campaign has preview status badge', async ({ page }) => {
    await createCampaign(page, 'Preview Campaign', 'A campaign in preview state.')
    await expect(page.getByText('preview', { exact: true })).toBeVisible()
  })
})

test.describe('Campaign creation', () => {
  test.beforeEach(async ({ page }) => {
    await registerBrand(page)
    await page.goto('/dashboard/campaigns/new')
  })

  test('displays the creation form', async ({ page }) => {
    await expect(page.getByLabel('Title')).toBeVisible()
    await expect(page.getByLabel('Description')).toBeVisible()
    await expect(page.getByRole('checkbox', { name: 'Crossfit' })).toBeVisible()
    await expect(page.getByRole('checkbox', { name: 'Triathlon' })).toBeVisible()
    await expect(page.getByRole('checkbox', { name: 'Motorsports' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create Campaign' })).toBeVisible()
  })

  test('shows validation errors when fields are empty', async ({ page }) => {
    await page.evaluate(() =>
      document.querySelectorAll('[required]').forEach(el => el.removeAttribute('required'))
    )
    await page.getByRole('button', { name: 'Create Campaign' }).click()
    await expect(page.getByText('Title must be at least 3 characters.')).toBeVisible()
    await expect(page.getByText('Description must be at least 10 characters.')).toBeVisible()
    await expect(page.getByText('Select at least one discipline.')).toBeVisible()
  })

  test('successful creation redirects to campaigns list and shows the campaign', async ({ page }) => {
    await page.getByLabel('Title').fill('Launch Campaign')
    await page.getByLabel('Description').fill('A campaign for the product launch.')
    await page.getByRole('checkbox', { name: 'Triathlon' }).click()
    await page.getByRole('button', { name: 'Create Campaign' }).click()

    await expect(page).toHaveURL('/dashboard/campaigns')
    await expect(page.getByText('Launch Campaign')).toBeVisible()
  })

  test('Back to Campaigns link navigates to list', async ({ page }) => {
    await page.getByRole('link', { name: /back to campaigns/i }).click()
    await expect(page).toHaveURL('/dashboard/campaigns')
  })
})

test.describe('Campaign preview', () => {
  test.beforeEach(async ({ page }) => {
    await registerBrand(page)
    await createCampaign(page, 'Preview Campaign', 'Full campaign description here.', 'Triathlon')
    await page.getByRole('link', { name: 'Preview' }).click()
  })

  test('displays campaign title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Preview Campaign' })).toBeVisible()
    await expect(page.getByText('Full campaign description here.')).toBeVisible()
  })

  test('displays campaign disciplines', async ({ page }) => {
    await expect(page.getByText('Triathlon')).toBeVisible()
  })

  test('displays Edit, Publish and Delete actions', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Edit' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Publish' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
  })

  test('publishing campaign changes status to active and hides Publish button', async ({ page }) => {
    await page.getByRole('button', { name: 'Publish' }).click()
    await page.waitForURL('/dashboard/campaigns')
    await page.getByRole('link', { name: 'Preview' }).click()
    await expect(page.getByText('active', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Publish' })).not.toBeVisible()
  })

  test('Back to Campaigns link navigates to list', async ({ page }) => {
    await page.getByRole('link', { name: /back to campaigns/i }).click()
    await expect(page).toHaveURL('/dashboard/campaigns')
  })
})

test.describe('Campaign edit', () => {
  test.beforeEach(async ({ page }) => {
    await registerBrand(page)
    await createCampaign(page, 'Original Title', 'Original description text here.', 'Crossfit')
    await page.getByRole('link', { name: 'Preview' }).click()
    await page.getByRole('link', { name: 'Edit' }).click()
  })

  test('pre-fills form with existing campaign data', async ({ page }) => {
    await expect(page.getByLabel('Title')).toHaveValue('Original Title')
    await expect(page.getByLabel('Description')).toHaveValue('Original description text here.')
    await expect(page.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
  })

  test('successful update redirects to campaigns list and shows updated title', async ({ page }) => {
    await page.getByLabel('Title').clear()
    await page.getByLabel('Title').fill('Updated Title')
    await page.getByRole('button', { name: 'Save Changes' }).click()

    await expect(page).toHaveURL('/dashboard/campaigns')
    await expect(page.getByText('Updated Title')).toBeVisible()
  })

  test('shows validation error when title is too short', async ({ page }) => {
    await page.evaluate(() =>
      document.querySelectorAll('[required]').forEach(el => el.removeAttribute('required'))
    )
    await page.getByLabel('Title').clear()
    await page.getByLabel('Title').fill('ab')
    await page.getByRole('button', { name: 'Save Changes' }).click()

    await expect(page.getByText('Title must be at least 3 characters.')).toBeVisible()
  })

  test('can change selected disciplines and changes are saved', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'Crossfit' }).click()
    await page.getByRole('checkbox', { name: 'Triathlon' }).click()
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await page.waitForURL('/dashboard/campaigns')
    await page.getByRole('link', { name: 'Preview' }).click()

    await expect(page.getByText('Triathlon')).toBeVisible()
    await expect(page.getByText('Crossfit')).not.toBeVisible()
  })
})

test.describe('Multiple disciplines', () => {
  test('all selected disciplines are saved and displayed in preview', async ({ page }) => {
    await registerBrand(page)
    await page.goto('/dashboard/campaigns/new')
    await page.getByLabel('Title').fill('Multi-Discipline Campaign')
    await page.getByLabel('Description').fill('A campaign spanning multiple disciplines.')
    await page.getByRole('checkbox', { name: 'Crossfit' }).click()
    await page.getByRole('checkbox', { name: 'Triathlon' }).click()
    await page.getByRole('checkbox', { name: 'Motorsports' }).click()
    await page.getByRole('button', { name: 'Create Campaign' }).click()
    await page.waitForURL('/dashboard/campaigns')
    await page.getByRole('link', { name: 'Preview' }).click()

    await expect(page.getByText('Crossfit')).toBeVisible()
    await expect(page.getByText('Triathlon')).toBeVisible()
    await expect(page.getByText('Motorsports')).toBeVisible()
  })
})

test.describe('Campaign deletion', () => {
  test('deletes campaign and removes it from the list', async ({ page }) => {
    await registerBrand(page)
    await createCampaign(page, 'To Be Deleted', 'This campaign will be deleted soon.')
    await page.getByRole('link', { name: 'Preview' }).click()

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page).toHaveURL('/dashboard/campaigns')
    await expect(page.getByText('To Be Deleted')).not.toBeVisible()
  })

  test('cancelling deletion keeps the campaign', async ({ page }) => {
    await registerBrand(page)
    await createCampaign(page, 'Keep This Campaign', 'This campaign should not be deleted.')
    await page.getByRole('link', { name: 'Preview' }).click()

    page.once('dialog', (dialog) => dialog.dismiss())
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByRole('heading', { name: 'Keep This Campaign' })).toBeVisible()
  })
})
