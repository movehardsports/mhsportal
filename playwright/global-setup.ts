import { cleanupTestData } from './cleanup'

export default async function globalSetup() {
  await cleanupTestData()
}
