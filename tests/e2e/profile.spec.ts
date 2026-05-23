import { test, expect, type Page } from '@playwright/test'

const testEmail = () => `test-${Date.now()}@playwright.test`

async function registerAthlete(page: Page) {
  await page.goto('/register')
  await page.getByRole('button', { name: 'Athlete' }).click()
  await page.getByLabel('Email address').fill(testEmail())
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.waitForURL('/onboarding')
  await page.getByLabel('First name').fill('John')
  await page.getByLabel('Last name').fill('Doe')
  await page.getByRole('checkbox', { name: 'Crossfit' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('/dashboard')
}

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

test.describe('Profile view', () => {
  test('athlete profile shows full name and disciplines', async ({ page }) => {
    await registerAthlete(page)
    await page.goto('/dashboard/profile')
    await expect(page.getByRole('heading', { name: 'John Doe' })).toBeVisible()
    await expect(page.getByText('Crossfit')).toBeVisible()
  })

  test('brand profile shows brand name and disciplines', async ({ page }) => {
    await registerBrand(page)
    await page.goto('/dashboard/profile')
    await expect(page.getByRole('heading', { name: 'Test Brand' })).toBeVisible()
    await expect(page.getByText('Crossfit')).toBeVisible()
  })

  test('"My Profile" nav link navigates to profile page', async ({ page }) => {
    await registerAthlete(page)
    await page.getByRole('link', { name: 'My Profile' }).click()
    await expect(page).toHaveURL('/dashboard/profile')
  })

  test('Edit button navigates to edit page', async ({ page }) => {
    await registerAthlete(page)
    await page.goto('/dashboard/profile')
    await page.getByRole('link', { name: 'Edit' }).click()
    await expect(page).toHaveURL('/dashboard/profile/edit')
  })
})

test.describe('Profile edit - athlete', () => {
  test.beforeEach(async ({ page }) => {
    await registerAthlete(page)
    await page.goto('/dashboard/profile/edit')
  })

  test('pre-fills name fields from profile', async ({ page }) => {
    await expect(page.getByLabel('First name')).toHaveValue('John')
    await expect(page.getByLabel('Last name')).toHaveValue('Doe')
  })

  test('pre-selects disciplines from profile', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
  })

  test('successful update redirects to profile and shows updated name', async ({ page }) => {
    await page.getByLabel('First name').clear()
    await page.getByLabel('First name').fill('Jane')
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await expect(page).toHaveURL('/dashboard/profile')
    await expect(page.getByRole('heading', { name: 'Jane Doe' })).toBeVisible()
  })

  test('shows validation error when first name is empty', async ({ page }) => {
    await page.evaluate(() =>
      document.querySelectorAll('[required]').forEach((el) => el.removeAttribute('required'))
    )
    await page.getByLabel('First name').clear()
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await expect(page.getByText('First name is required.')).toBeVisible()
  })

  test('Back to Profile link navigates to profile page', async ({ page }) => {
    await page.getByRole('link', { name: /back to profile/i }).click()
    await expect(page).toHaveURL('/dashboard/profile')
  })
})

test.describe('Profile edit - brand', () => {
  test.beforeEach(async ({ page }) => {
    await registerBrand(page)
    await page.goto('/dashboard/profile/edit')
  })

  test('displays brand name as read-only text', async ({ page }) => {
    await expect(page.getByText('Test Brand')).toBeVisible()
    await expect(page.locator('input[name="brand_name"]')).not.toBeAttached()
  })

  test('pre-selects disciplines from profile', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
  })

  test('successful update redirects to profile and shows updated disciplines', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'Crossfit' }).click()
    await page.getByRole('checkbox', { name: 'Triathlon' }).click()
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await expect(page).toHaveURL('/dashboard/profile')
    await expect(page.getByText('Triathlon')).toBeVisible()
  })
})

test.describe('Account deletion', () => {
  test('cancelling confirmation keeps the user on edit page', async ({ page }) => {
    await registerAthlete(page)
    await page.goto('/dashboard/profile/edit')
    page.once('dialog', (dialog) => dialog.dismiss())
    await page.getByRole('button', { name: 'Delete account' }).click()
    await expect(page).toHaveURL('/dashboard/profile/edit')
  })

  test('confirming deletion deletes account and redirects to home', async ({ page }) => {
    await registerAthlete(page)
    await page.goto('/dashboard/profile/edit')
    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Delete account' }).click()
    await expect(page).toHaveURL('/')
  })
})
