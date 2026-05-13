import { test, expect } from '@playwright/test'

const testEmail = () => `test-${Date.now()}@playwright.test`

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('displays the registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Athlete' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Brand' })).toBeVisible()
    await expect(page.getByLabel('Email address')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('shows error when account type is not selected', async ({ page }) => {
    await page.getByLabel('Email address').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Join' }).click()

    await expect(page.getByText('Select account type.')).toBeVisible()
  })

  test('shows error when password is too short', async ({ page }) => {
    await page.getByRole('button', { name: 'Athlete' }).click()
    await page.getByLabel('Email address').fill('test@example.com')
    await page.getByLabel('Password').fill('123')
    await page.getByRole('button', { name: 'Join' }).click()

    await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible()
  })

  test('successful registration as athlete redirects to onboarding', async ({ page }) => {
    await page.getByRole('button', { name: 'Athlete' }).click()
    await page.getByLabel('Email address').fill(testEmail())
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Join' }).click()

    await expect(page).toHaveURL('/onboarding')
    await expect(page.getByRole('heading', { name: 'Complete your profile' })).toBeVisible()
    await expect(page.getByLabel('First name')).toBeVisible()
    await expect(page.getByLabel('Last name')).toBeVisible()
  })

  test('successful registration as brand redirects to onboarding with brand name field', async ({ page }) => {
    await page.getByRole('button', { name: 'Brand' }).click()
    await page.getByLabel('Email address').fill(testEmail())
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Join' }).click()

    await expect(page).toHaveURL('/onboarding')
    await expect(page.getByLabel('Brand name')).toBeVisible()
  })
})
