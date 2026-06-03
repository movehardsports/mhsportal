'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/dal'
import { z } from 'zod'
import { DISCIPLINE_IDS } from '@/types/discipline'

const AthleteSchema = z.object({
  first_name: z
    .string()
    .min(1, { error: 'First name is required.' })
    .max(100, { error: 'First name must be at most 100 characters.' })
    .trim(),
  last_name: z
    .string()
    .min(1, { error: 'Last name is required.' })
    .max(100, { error: 'Last name must be at most 100 characters.' })
    .trim(),
  disciplines: z
    .array(z.enum(DISCIPLINE_IDS))
    .min(1, { error: 'Select at least one discipline.' }),
  bio: z.string().max(500, { error: 'Bio must be at most 500 characters.' }).trim().optional(),
  location: z.string().max(100, { error: 'Location must be at most 100 characters.' }).trim().optional(),
})

const BrandSchema = z.object({
  disciplines: z
    .array(z.enum(DISCIPLINE_IDS))
    .min(1, { error: 'Select at least one discipline.' }),
  bio: z.string().max(500, { error: 'Bio must be at most 500 characters.' }).trim().optional(),
  location: z.string().max(100, { error: 'Location must be at most 100 characters.' }).trim().optional(),
  website: z.string().max(200, { error: 'Website must be at most 200 characters.' }).trim().optional(),
  contact_email: z.string().email({ error: 'Enter a valid email address.' }).trim().optional().or(z.literal('')),
})

export type ProfileFormState = {
  errors?: {
    first_name?: string[]
    last_name?: string[]
    disciplines?: string[]
    bio?: string[]
    location?: string[]
    website?: string[]
    contact_email?: string[]
    general?: string
  }
} | undefined

export async function updateProfile(
  _state: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const profile = await getProfile()
  if (!profile) {
    return { errors: { general: 'Unauthorized.' } }
  }

  const disciplines = formData
    .getAll('disciplines')
    .filter((v): v is string => typeof v === 'string')

  if (profile.account_type === 'athlete') {
    const parsed = AthleteSchema.safeParse({
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      disciplines,
      bio: formData.get('bio') || undefined,
      location: formData.get('location') || undefined,
    })

    if (!parsed.success) {
      return { errors: z.flattenError(parsed.error).fieldErrors }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        disciplines: parsed.data.disciplines,
        bio: parsed.data.bio ?? null,
        location: parsed.data.location ?? null,
      })
      .eq('id', profile.id)

    if (error) {
      console.error('[updateProfile]', error.message)
      return { errors: { general: 'Could not update profile. Please try again.' } }
    }
  } else {
    const parsed = BrandSchema.safeParse({
      disciplines,
      bio: formData.get('bio') || undefined,
      location: formData.get('location') || undefined,
      website: formData.get('website') || undefined,
      contact_email: formData.get('contact_email') || undefined,
    })

    if (!parsed.success) {
      return { errors: z.flattenError(parsed.error).fieldErrors }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        disciplines: parsed.data.disciplines,
        bio: parsed.data.bio ?? null,
        location: parsed.data.location ?? null,
        website: parsed.data.website ?? null,
        contact_email: parsed.data.contact_email || null,
      })
      .eq('id', profile.id)

    if (error) {
      console.error('[updateProfile]', error.message)
      return { errors: { general: 'Could not update profile. Please try again.' } }
    }
  }

  revalidatePath('/dashboard/profile')
  redirect('/dashboard/profile')
}

export type DeleteAccountState = { error?: string } | undefined

export async function deleteAccount(
  _state: DeleteAccountState,
  _formData: FormData
): Promise<DeleteAccountState> {
  const profile = await getProfile()
  if (!profile) {
    return { error: 'Unauthorized.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('delete_user_account')

  if (error) {
    console.error('[deleteAccount]', error.message)
    return { error: `${error.message}` }
  }

  redirect('/')
}
