'use server'

import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/dal'
import { revalidatePath } from 'next/cache'

export type ApplyState = { error?: string; success?: boolean } | undefined

export async function applyToCampaign(
  _state: ApplyState,
  formData: FormData
): Promise<ApplyState> {
  const campaignId = formData.get('campaign_id')
  if (typeof campaignId !== 'string' || !campaignId) {
    return { error: 'Invalid campaign.' }
  }

  const profile = await getProfile()
  if (!profile || profile.account_type !== 'athlete') {
    return { error: 'Only athletes can apply to campaigns.' }
  }

  const message = formData.get('message')
  const trimmedMessage = typeof message === 'string' ? message.trim() || null : null

  const supabase = await createClient()
  const { error } = await supabase.from('campaign_applications').insert({
    campaign_id: campaignId,
    athlete_id: profile.id,
    message: trimmedMessage,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already applied to this campaign.' }
    }
    console.error('[applyToCampaign]', error.message)
    return { error: 'Could not submit application. Please try again.' }
  }

  revalidatePath(`/campaigns/${campaignId}`)
  return { success: true }
}

export type ManageApplicationState = { error?: string } | undefined

export async function updateApplication(
  _state: ManageApplicationState,
  formData: FormData
): Promise<ManageApplicationState> {
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) return { error: 'Invalid application.' }

  const profile = await getProfile()
  if (!profile || profile.account_type !== 'athlete') return { error: 'Unauthorized.' }

  const message = formData.get('message')
  const trimmedMessage = typeof message === 'string' ? message.trim() || null : null

  const supabase = await createClient()
  const { error } = await supabase
    .from('campaign_applications')
    .update({ message: trimmedMessage })
    .eq('id', id)
    .eq('athlete_id', profile.id)
    .eq('status', 'pending')

  if (error) {
    console.error('[updateApplication]', error.message)
    return { error: 'Could not update application. Please try again.' }
  }

  revalidatePath('/dashboard/applications')
}

export async function withdrawApplication(
  _state: ManageApplicationState,
  formData: FormData
): Promise<ManageApplicationState> {
  const id = formData.get('id')
  if (typeof id !== 'string' || !id) return { error: 'Invalid application.' }

  const profile = await getProfile()
  if (!profile || profile.account_type !== 'athlete') return { error: 'Unauthorized.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('campaign_applications')
    .delete()
    .eq('id', id)
    .eq('athlete_id', profile.id)
    .eq('status', 'pending')

  if (error) {
    console.error('[withdrawApplication]', error.message)
    return { error: 'Could not withdraw application. Please try again.' }
  }

  revalidatePath('/dashboard/applications')
}
