'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/dal'
import { z } from 'zod'
import { DISCIPLINE_IDS } from '@/types/discipline'

const CampaignSchema = z.object({
  title: z
    .string()
    .min(3, { error: 'Title must be at least 3 characters.' })
    .max(200, { error: 'Title must be at most 200 characters.' })
    .trim(),
  description: z
    .string()
    .min(10, { error: 'Description must be at least 10 characters.' })
    .max(5000, { error: 'Description must be at most 5000 characters.' })
    .trim(),
  disciplines: z
    .array(z.enum(DISCIPLINE_IDS))
    .min(1, { error: 'Select at least one discipline.' }),
})

export type CampaignFormState = {
  errors?: {
    title?: string[]
    description?: string[]
    disciplines?: string[]
    general?: string
  }
} | undefined

export type DeleteState = { error?: string } | undefined

export async function createCampaign(
  _state: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  const parsed = CampaignSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    disciplines: formData.getAll('disciplines').filter((v): v is string => typeof v === 'string'),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const profile = await getProfile()
  if (!profile || profile.account_type !== 'brand') {
    return { errors: { general: 'Unauthorized.' } }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('campaigns').insert({
    brand_id: profile.id,
    title: parsed.data.title,
    description: parsed.data.description,
    disciplines: parsed.data.disciplines,
    status: 'preview',
  })

  if (error) {
    console.error('[createCampaign]', error.message)
    return { errors: { general: 'Could not create campaign. Please try again.' } }
  }

  redirect('/dashboard/campaigns')
}

export async function updateCampaign(
  id: string,
  _state: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  const parsed = CampaignSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    disciplines: formData.getAll('disciplines').filter((v): v is string => typeof v === 'string'),
  })

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors }
  }

  const profile = await getProfile()
  if (!profile || profile.account_type !== 'brand') {
    return { errors: { general: 'Unauthorized.' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .update({ title: parsed.data.title, description: parsed.data.description, disciplines: parsed.data.disciplines })
    .eq('id', id)
    .eq('brand_id', profile.id)
    .select('id')

  if (error || !data?.length) {
    console.error('[updateCampaign]', error?.message ?? 'no rows updated')
    return { errors: { general: 'Campaign not found or could not be updated.' } }
  }

  redirect('/dashboard/campaigns')
}

export type PublishState = { error?: string } | undefined

export async function publishCampaign(
  _state: PublishState,
  formData: FormData
): Promise<PublishState> {
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) {
    return { error: 'Invalid campaign.' }
  }

  const profile = await getProfile()
  if (!profile || profile.account_type !== 'brand') {
    return { error: 'Unauthorized.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('campaigns')
    .update({ status: 'active' })
    .eq('id', id)
    .eq('brand_id', profile.id)
    .eq('status', 'preview')

  if (error) {
    console.error('[publishCampaign]', error.message)
    return { error: 'Could not publish campaign. Please try again.' }
  }

  redirect('/dashboard/campaigns')
}

export async function deleteCampaign(
  _state: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) {
    return { error: 'Invalid campaign.' }
  }

  const profile = await getProfile()
  if (!profile || profile.account_type !== 'brand') {
    return { error: 'Unauthorized.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)
    .eq('brand_id', profile.id)

  if (error) {
    console.error('[deleteCampaign]', error.message)
    return { error: 'Could not delete campaign. Please try again.' }
  }

  redirect('/dashboard/campaigns')
}
