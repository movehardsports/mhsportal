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

test.describe('Dashboard access control', () => {
  test('unauthenticated user is redirected to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('authenticated user without completed onboarding is redirected to /onboarding', async ({ page }) => {
    await registerUser(page, 'Athlete')
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/onboarding')
  })

  test('authenticated user with completed onboarding can access dashboard', async ({ page }) => {
    await registerUser(page, 'Athlete')
    await page.getByLabel('First name').fill('John')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByRole('checkbox', { name: 'Crossfit' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Brand-only routes', () => {
  test('athlete account is redirected from /dashboard/campaigns to /dashboard', async ({ page }) => {
    await registerUser(page, 'Athlete')
    await page.getByLabel('First name').fill('John')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByRole('checkbox', { name: 'Crossfit' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.waitForURL('/dashboard')

    await page.goto('/dashboard/campaigns')
    await expect(page).toHaveURL('/dashboard')
  })
})
