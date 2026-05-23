import { test, expect, type Browser, type Page } from '@playwright/test'

const testEmail = () => `test-${Date.now()}@playwright.test`

async function registerAthlete(browser: Browser): Promise<string> {
  const email = testEmail()
  const page = await browser.newPage()
  await page.goto('/register')
  await page.getByRole('button', { name: 'Athlete' }).click()
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.waitForURL('/onboarding')
  await page.getByLabel('First name').fill('John')
  await page.getByLabel('Last name').fill('Doe')
  await page.getByRole('checkbox', { name: 'Crossfit' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('/dashboard')
  await page.close()
  return email
}

async function registerBrand(browser: Browser): Promise<string> {
  const email = testEmail()
  const page = await browser.newPage()
  await page.goto('/register')
  await page.getByRole('button', { name: 'Brand' }).click()
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.waitForURL('/onboarding')
  await page.getByLabel('Brand name').fill('Test Brand')
  await page.getByRole('checkbox', { name: 'Crossfit' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('/dashboard')
  await page.close()
  return email
}

async function signIn(page: Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForURL('/dashboard')
}

// ─── Profile view ────────────────────────────────────────────────────────────

test.describe('Profile view', () => {
  let athleteEmail: string
  let brandEmail: string

  test.beforeAll(async ({ browser }) => {
    athleteEmail = await registerAthlete(browser)
    brandEmail = await registerBrand(browser)
  })

  test('athlete profile shows full name and disciplines', async ({ page }) => {
    await signIn(page, athleteEmail)
    await page.goto('/dashboard/profile')
    await expect(page.getByRole('heading', { name: 'John Doe' })).toBeVisible()
    await expect(page.getByText('Crossfit')).toBeVisible()
  })

  test('brand profile shows brand name and disciplines', async ({ page }) => {
    await signIn(page, brandEmail)
    await page.goto('/dashboard/profile')
    await expect(page.getByRole('heading', { name: 'Test Brand' })).toBeVisible()
    await expect(page.getByText('Crossfit')).toBeVisible()
  })

  test('"My Profile" nav link navigates to profile page', async ({ page }) => {
    await signIn(page, athleteEmail)
    await page.getByRole('link', { name: 'My Profile' }).click()
    await expect(page).toHaveURL('/dashboard/profile')
  })

  test('Edit button navigates to edit page', async ({ page }) => {
    await signIn(page, athleteEmail)
    await page.goto('/dashboard/profile')
    await page.getByRole('link', { name: 'Edit' }).click()
    await expect(page).toHaveURL('/dashboard/profile/edit')
  })
})

// ─── Profile edit - athlete ───────────────────────────────────────────────────

test.describe('Profile edit - athlete', () => {
  let athleteEmail: string

  test.beforeAll(async ({ browser }) => {
    athleteEmail = await registerAthlete(browser)
  })

  test.beforeEach(async ({ page }) => {
    await signIn(page, athleteEmail)
    await page.goto('/dashboard/profile/edit')
  })

  test('pre-fills name fields from profile', async ({ page }) => {
    await expect(page.getByLabel('First name')).toHaveValue('John')
    await expect(page.getByLabel('Last name')).toHaveValue('Doe')
  })

  test('pre-selects disciplines from profile', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'Crossfit' })).toHaveAttribute('aria-checked', 'true')
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

  test('successful update redirects to profile and shows updated name', async ({ page }) => {
    await page.getByLabel('First name').clear()
    await page.getByLabel('First name').fill('Jane')
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await expect(page).toHaveURL('/dashboard/profile')
    await expect(page.getByRole('heading', { name: 'Jane Doe' })).toBeVisible()
  })
})

// ─── Profile edit - brand ─────────────────────────────────────────────────────

test.describe('Profile edit - brand', () => {
  let brandEmail: string

  test.beforeAll(async ({ browser }) => {
    brandEmail = await registerBrand(browser)
  })

  test.beforeEach(async ({ page }) => {
    await signIn(page, brandEmail)
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

// ─── Account deletion ─────────────────────────────────────────────────────────

test.describe('Account deletion', () => {
  test('cancelling confirmation keeps the user on edit page', async ({ page, browser }) => {
    const email = await registerAthlete(browser)
    await signIn(page, email)
    await page.goto('/dashboard/profile/edit')
    page.once('dialog', (dialog) => dialog.dismiss())
    await page.getByRole('button', { name: 'Delete account' }).click()
    await expect(page).toHaveURL('/dashboard/profile/edit')
  })

  test('confirming deletion deletes account and redirects to home', async ({ page, browser }) => {
    const email = await registerAthlete(browser)
    await signIn(page, email)
    await page.goto('/dashboard/profile/edit')
    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Delete account' }).click()
    await expect(page).toHaveURL('/')
  })
})
