import { test, expect, type Page } from '@playwright/test'

const testEmail = () => `test-${Date.now()}@playwright.test`

async function registerUser(page: Page, accountType: 'Athlete' | 'Brand'): Promise<string> {
  const email = testEmail()
  await page.goto('/register')
  await page.getByRole('button', { name: accountType }).click()
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.waitForURL('/onboarding')
  return email
}

async function completeOnboarding(page: Page) {
  await page.getByLabel('First name').fill('Test')
  await page.getByLabel('Last name').fill('User')
  await page.getByRole('checkbox', { name: 'Crossfit' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('/dashboard')
}

async function signOutUser(page: Page) {
  await page.goto('/dashboard')
  await page.getByRole('button', { name: /sign out/i }).first().click()
  await page.waitForURL('/')
}

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('displays the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible()
    await expect(page.getByLabel('Email address')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible()
  })

  test('shows validation errors when fields are empty', async ({ page }) => {
    await page.evaluate(() =>
      document.querySelectorAll('[required]').forEach(el => el.removeAttribute('required'))
    )
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Email is required.')).toBeVisible()
    await expect(page.getByText('Password is required.')).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email address').fill('nonexistent@playwright.test')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText(/invalid login credentials/i)).toBeVisible()
  })

  test('successful login redirects to /onboarding when onboarding not completed', async ({ page }) => {
    const email = await registerUser(page, 'Athlete')
    await signOutUser(page)

    await page.goto('/login')
    await page.getByLabel('Email address').fill(email)
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page).toHaveURL('/onboarding')
  })

  test('successful login redirects to /dashboard when onboarding is completed', async ({ page }) => {
    const email = await registerUser(page, 'Athlete')
    await completeOnboarding(page)
    await signOutUser(page)

    await page.goto('/login')
    await page.getByLabel('Email address').fill(email)
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Sign out', () => {
  test('dashboard header shows sign out button when logged in', async ({ page }) => {
    await registerUser(page, 'Athlete')
    await page.goto('/dashboard')
    await expect(page.getByRole('button', { name: /sign out/i }).first()).toBeVisible()
  })

  test('sign out redirects to homepage', async ({ page }) => {
    await registerUser(page, 'Athlete')
    await signOutUser(page)
    await expect(page).toHaveURL('/')
  })
})
