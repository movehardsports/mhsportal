import { test, expect, type Page } from '@playwright/test'

const testEmail = () => `test-${Date.now()}@playwright.test`

async function registerUser(page: Page, accountType: 'Athlete' | 'Brand') {
  await page.goto('/register')
  await page.getByRole('button', { name: accountType }).click()
  await page.getByLabel('Email address').fill(testEmail())
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.waitForURL('/onboarding')
}

test.describe('Onboarding — athlete', () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page, 'Athlete')
  })

  test('displays form with first name and last name fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Complete your profile' })).toBeVisible()
    await expect(page.getByLabel('First name')).toBeVisible()
    await expect(page.getByLabel('Last name')).toBeVisible()
  })

  test('shows server validation errors when fields are empty', async ({ page }) => {
    await page.evaluate(() =>
      document.querySelectorAll('[required]').forEach(el => el.removeAttribute('required'))
    )
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.getByText('First name is required.')).toBeVisible()
    await expect(page.getByText('Last name is required.')).toBeVisible()
    await expect(page.getByText('Select at least one discipline.')).toBeVisible()
  })

  test('redirects to home on successful submission', async ({ page }) => {
    await page.getByLabel('First name').fill('John')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByRole('checkbox', { name: 'Crossfit' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Onboarding — already completed', () => {
  test('redirects to home if onboarding already done', async ({ page }) => {
    await registerUser(page, 'Athlete')
    await page.getByLabel('First name').fill('John')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByRole('checkbox', { name: 'Crossfit' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.waitForURL('/dashboard')

    await page.goto('/onboarding')
    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Onboarding — brand', () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page, 'Brand')
  })

  test('displays form with brand name field', async ({ page }) => {
    await expect(page.getByLabel('Brand name')).toBeVisible()
  })

  test('shows server validation error when field is empty', async ({ page }) => {
    await page.evaluate(() =>
      document.querySelectorAll('[required]').forEach(el => el.removeAttribute('required'))
    )
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.getByText('Brand name is required.')).toBeVisible()
    await expect(page.getByText('Select at least one discipline.')).toBeVisible()
  })

  test('redirects to home on successful submission', async ({ page }) => {
    await page.getByLabel('Brand name').fill('Nike')
    await page.getByRole('checkbox', { name: 'Crossfit' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).toHaveURL('/dashboard')
  })
})
