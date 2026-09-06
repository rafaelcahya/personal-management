'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, ImageUp, AlertCircle } from 'lucide-react'
import Card, {
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/base/Card/Card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/base/Avatar/Avatar'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import { uploadAvatar, updateUser } from '@/lib/api/user'
import { useUserProfile } from '@/app/main/components/UserProfileProvider'

const MAX_SIZE_BYTES = 2 * 1024 * 1024
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

function initialsOf(profile) {
  const source = profile?.nickname || profile?.username || ''
  return source.charAt(0).toUpperCase() || 'U'
}

export default function AvatarSection() {
  const { profile, loading, error, refetch, updateAvatar } = useUserProfile()
  const [uploading, setUploading] = useState(false)
  const [fieldError, setFieldError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    // Reset so selecting the same file again still fires onChange.
    event.target.value = ''
    if (!file) return

    setFieldError(null)
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFieldError('Use a PNG, JPG, or WEBP image.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setFieldError('Image must be 2 MB or smaller.')
      return
    }

    setUploading(true)
    try {
      const { url } = await uploadAvatar(file)
      await updateUser({ avatar: url })
      updateAvatar(url)
      toast.success('Avatar updated')
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card as="section" aria-label="Avatar" id="avatarSection_settingsPage">
      <CardHeader>
        <CardIcon icon={ImageUp} />
        <CardHeaderContent>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>PNG, JPG, or WEBP — up to 2 MB.</CardDescription>
        </CardHeaderContent>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <Skeleton className="h-9 w-32 rounded" />
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
              id="avatarRetryBtn_settingsPage"
              className="text-violet-600 font-medium"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar size="2xl">
              {profile?.avatar && <AvatarImage src={profile.avatar} alt="Your avatar" />}
              <AvatarFallback className="bg-secondary text-primary font-semibold">
                {initialsOf(profile)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1.5">
              <input
                ref={inputRef}
                id="avatarUploadInput_settingsPage"
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleFile}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                id="avatarUploadBtn_settingsPage"
                className="text-violet-600 font-medium"
              >
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploading ? 'Uploading...' : 'Upload new avatar'}
              </Button>
              {fieldError && (
                <p className="text-xs font-medium text-rose-600" id="avatarError_settingsPage">
                  {fieldError}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
