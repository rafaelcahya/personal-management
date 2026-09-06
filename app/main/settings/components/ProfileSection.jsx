'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, UserRound, AlertCircle } from 'lucide-react'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'
import { FieldContainer, FieldContent, FieldLabel, FieldError } from '@/components/base/Field/Field'
import Input from '@/components/base/Input/Input'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { profileSchema } from '@/schemas/user'
import { updateUser } from '@/lib/api/user'
import { useUserProfile } from '@/app/main/components/UserProfileProvider'

const FIELD_STYLING =
  'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500'

export default function ProfileSection() {
  const { profile, loading, error, refetch, setProfile } = useUserProfile()
  const [saving, setSaving] = useState(false)

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '', nickname: '' },
  })
  const { control, handleSubmit, reset } = form

  // Prefill once the profile arrives (or after a refetch).
  useEffect(() => {
    if (profile) {
      reset({ username: profile.username ?? '', nickname: profile.nickname ?? '' })
    }
  }, [profile, reset])

  const onSubmit = async (values) => {
    // Send only fields that actually changed.
    const changed = {}
    if (values.username !== (profile?.username ?? '')) changed.username = values.username
    if (values.nickname !== (profile?.nickname ?? '')) changed.nickname = values.nickname

    if (Object.keys(changed).length === 0) {
      toast.info('No changes to save')
      return
    }

    setSaving(true)
    try {
      await updateUser(changed)
      setProfile((prev) => ({ ...prev, ...changed }))
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card as="section" aria-label="Profile" id="profileSection_settingsPage">
      <CardHeader>
        <CardIcon icon={UserRound} />
        <CardHeaderContent>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your username and nickname.</CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-9 w-28 rounded" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-start gap-3 py-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="size-4 text-rose-500" />
              {error}
            </p>
            <Button
              variant="secondary"
              onClick={refetch}
              id="profileRetryBtn_settingsPage"
              className="text-violet-600 font-medium"
            >
              Retry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FieldContainer>
              <Controller
                control={control}
                name="username"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Username</FieldLabel>
                    <Input
                      {...field}
                      id="usernameField_settingsPage"
                      placeholder="e.g. rafaelcahya"
                      className={`${FIELD_STYLING} ${fieldState.error ? 'border-rose-500' : ''}`}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              <Controller
                control={control}
                name="nickname"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Nickname</FieldLabel>
                    <Input
                      {...field}
                      id="nicknameField_settingsPage"
                      placeholder="e.g. Cahya"
                      className={`${FIELD_STYLING} ${fieldState.error ? 'border-rose-500' : ''}`}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />
            </FieldContainer>

            <div>
              <Button type="submit" disabled={saving} id="saveProfileBtn_settingsPage">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
