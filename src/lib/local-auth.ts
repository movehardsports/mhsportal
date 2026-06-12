export type Role = 'athlete' | 'brand'

export type StoredUser = {
  id: string
  email: string
  password: string
  name: string
  role: Role
  createdAt: string
}

export type Session = {
  userId: string
}

const USERS_KEY = 'mhs_users'
const SESSION_KEY = 'mhs_session'

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function register(data: {
  email: string
  password: string
  name: string
  role: Role
}): StoredUser {
  const users = getUsers()
  if (users.some((u) => u.email === data.email)) {
    throw new Error('An account with this email already exists.')
  }
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role,
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, user])
  return user
}

export function login(email: string, password: string): StoredUser {
  const user = getUsers().find((u) => u.email === email)
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password.')
  }
  return user
}

export function saveSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }))
}

export function getSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getUserById(id: string): StoredUser | null {
  return getUsers().find((u) => u.id === id) ?? null
}
