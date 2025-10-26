'use client'

import { useState } from 'react'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  currentImage?: string
  label?: string
}

export default function ImageUpload({ onUploadComplete, currentImage, label = 'Upload Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary via our API
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      if (data.url) {
        onUploadComplete(data.url)
        setPreview(data.url)
      } else {
        throw new Error('No URL returned from upload')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image. Please try again.')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {preview && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <div className={`
            px-4 py-2 border-2 border-dashed rounded-lg text-center cursor-pointer
            transition-colors
            ${uploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-ocean-300 hover:border-ocean-500 hover:bg-ocean-50'
            }
          `}>
            {uploading ? (
              <span className="text-gray-500">Uploading...</span>
            ) : (
              <span className="text-ocean-600 font-medium">
                📁 {preview ? 'Change Image' : 'Choose Image'}
              </span>
            )}
          </div>
        </label>

        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null)
              onUploadComplete('')
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Supported: JPG, PNG, GIF, WebP (max 5MB)
      </p>
    </div>
  )
}
