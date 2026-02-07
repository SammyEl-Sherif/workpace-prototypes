import { useManualFetch } from '@/hooks'
import { GoodThingMedia } from '@/interfaces/good-things'
import { getSupabaseClient } from '@/utils/supabase/client'
import { Button, Text } from '@workpace/design-system'
import { useRef, useState } from 'react'
import styles from './MediaUpload.module.scss'

interface MediaUploadProps {
  goodThingId: string
  onUploadComplete: () => void
}

const ACCEPTED_TYPES = {
  photo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
}

const ALL_ACCEPTED = [...ACCEPTED_TYPES.photo, ...ACCEPTED_TYPES.video]

export const MediaUpload = ({ goodThingId, onUploadComplete }: MediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const createMediaRecord = useManualFetch<{ data: { media: GoodThingMedia } }>(
    'good-stuff-list/good-thing-media'
  )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validate file type
    if (!ALL_ACCEPTED.includes(file.type)) {
      setUploadError('Please upload a photo (JPEG, PNG, GIF, WebP) or video (MP4, MOV, WebM)')
      return
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File must be under 50MB')
      return
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    setIsUploading(true)

    try {
      const supabase = getSupabaseClient()

      // Get current session for auth
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        throw new Error('You must be signed in to upload files')
      }

      const userId = session.user.id
      const timestamp = Date.now()
      const ext = file.name.split('.').pop() || 'unknown'
      const storagePath = `${userId}/${timestamp}-${file.name}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('good-thing-media')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('good-thing-media')
        .getPublicUrl(storagePath)

      const mediaType: 'photo' | 'video' = ACCEPTED_TYPES.photo.includes(file.type)
        ? 'photo'
        : 'video'

      // Create media record in database
      const [response, apiError] = await createMediaRecord({
        method: 'post',
        data: {
          good_thing_id: goodThingId,
          file_name: file.name,
          storage_path: storagePath,
          media_type: mediaType,
          media_url: publicUrlData.publicUrl,
          thumbnail_url: mediaType === 'photo' ? publicUrlData.publicUrl : null,
          file_size_bytes: file.size,
          mime_type: file.type,
        },
      })

      if (apiError) {
        throw apiError
      }

      onUploadComplete()
      setPreview(null)
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALL_ACCEPTED.join(',')}
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />

      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Upload preview" className={styles.previewImage} />
        </div>
      )}

      {uploadError && (
        <div className={styles.error}>
          <Text variant="body-sm" color="error-600">
            {uploadError}
          </Text>
        </div>
      )}

      <button
        type="button"
        className={styles.uploadButton}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <span className={styles.uploadingText}>
            <span className={styles.spinner} />
            Uploading...
          </span>
        ) : (
          <span className={styles.uploadText}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Photo or Video
          </span>
        )}
      </button>
    </div>
  )
}
