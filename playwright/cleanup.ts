import { createClient } from '@supabase/supabase-js'

export async function cleanupTestData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Skipping E2E cleanup: SUPABASE_SERVICE_ROLE_KEY not set in .env.local')
    return
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data } = await supabase.auth.admin.listUsers()
  const testUsers = data?.users.filter(u => u.email?.endsWith('@playwright.test')) ?? []

  if (testUsers.length === 0) return

  const testUserIds = testUsers.map(u => u.id)

  await supabase.from('campaigns').delete().in('brand_id', testUserIds)
  await Promise.all(testUsers.map(u => supabase.auth.admin.deleteUser(u.id)))

  console.log(`E2E cleanup: deleted ${testUsers.length} test user(s) and their campaigns`)
}
