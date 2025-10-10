'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Button from '@/app/components/ui/Button'
import Image from 'next/image'

interface FormData {
  name: string
  email: string
  phone: string
  itemType: 'bracelet' | 'necklace' | ''
  description: string
  budget: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  itemType?: string
  description?: string
  budget?: string
  image?: string
}

export default function CustomDesignPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    itemType: '',
    description: '',
    budget: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Animation refs
  const headerRef = useRef(null)
  const uploadRef = useRef(null)
  const formRef = useRef(null)
  const infoRef = useRef(null)

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
  const uploadInView = useInView(uploadRef, { once: true, amount: 0.2 })
  const formInView = useInView(formRef, { once: true, amount: 0.2 })
  const infoInView = useInView(infoRef, { once: true, amount: 0.2 })

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'Image size must be less than 10MB',
        }))
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: 'Please upload a valid image file',
        }))
        return
      }

      setSelectedImage(file)
      setErrors((prev) => ({ ...prev, image: undefined }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (use format: 123-456-7890)'
    }

    if (!formData.itemType) {
      newErrors.itemType = 'Please select an item type'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (!selectedImage) {
      newErrors.image = 'Please upload an image of your design'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    // For now, show a success message directing users to email
    setTimeout(() => {
      setSubmitStatus({
        type: 'success',
        message:
          "Thank you for your interest! Please email your design photo and details to shenna@shennastudio.com and we'll get back to you within 24 hours to discuss your custom piece.",
      })
      setIsSubmitting(false)
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        itemType: '',
        description: '',
        budget: '',
      })
      handleRemoveImage()
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-seafoam-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-block px-4 py-2 bg-ocean-100 text-ocean-700 rounded-full text-sm font-semibold mb-4">
              Custom Design Upload
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-display font-bold text-ocean-900 mb-6"
          >
            Create Your{' '}
            <span className="bg-gradient-to-r from-ocean-600 to-seafoam-500 bg-clip-text text-transparent">
              Dream Piece
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-ocean-600 max-w-3xl mx-auto leading-relaxed"
          >
            Upload a photo of your design inspiration and we&apos;ll bring it to
            life with our ocean-themed craftsmanship. Whether it&apos;s a
            bracelet or necklace, we&apos;ll create something uniquely yours.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Upload and Form */}
          <div className="space-y-8">
            {/* Image Upload Section */}
            <motion.div
              ref={uploadRef}
              initial="hidden"
              animate={uploadInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-ocean-100"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={uploadInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-display font-bold text-ocean-900 mb-2">
                  Upload Your Design
                </h2>
                <p className="text-ocean-600 mb-6">
                  Share a photo of your inspiration, sketch, or reference image
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={uploadInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {!imagePreview ? (
                  <motion.div
                    onClick={handleImageClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-4 border-dashed border-ocean-200 rounded-2xl p-12 text-center cursor-pointer hover:border-ocean-400 hover:bg-ocean-50 transition-all"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-6xl mb-4">📸</span>
                      <h3 className="text-xl font-semibold text-ocean-800 mb-2">
                        Click to upload image
                      </h3>
                      <p className="text-ocean-600 mb-4">
                        or drag and drop your design photo here
                      </p>
                      <p className="text-sm text-ocean-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-2xl overflow-hidden border-4 border-ocean-200"
                  >
                    <Image
                      src={imagePreview}
                      alt="Design preview"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <motion.button
                      type="button"
                      onClick={handleRemoveImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-3 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <span className="text-xl">✕</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleImageClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-4 right-4 bg-ocean-500 text-white rounded-xl px-4 py-2 shadow-lg hover:bg-ocean-600 transition-colors"
                    >
                      Change Image
                    </motion.button>
                  </motion.div>
                )}

                {errors.image && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    {errors.image}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>

            {/* Form Section */}
            <motion.div
              ref={formRef}
              initial="hidden"
              animate={formInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-ocean-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-ocean-700 mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all ${
                      errors.name
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-ocean-200'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-ocean-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-ocean-200'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-ocean-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all ${
                      errors.phone
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-ocean-200'
                    }`}
                    placeholder="123-456-7890"
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </motion.div>

                {/* Item Type Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <label
                    htmlFor="itemType"
                    className="block text-sm font-semibold text-ocean-700 mb-2"
                  >
                    Item Type *
                  </label>
                  <select
                    id="itemType"
                    name="itemType"
                    value={formData.itemType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all ${
                      errors.itemType
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-ocean-200'
                    }`}
                  >
                    <option value="">Select item type...</option>
                    <option value="bracelet">Bracelet</option>
                    <option value="necklace">Necklace</option>
                  </select>
                  {errors.itemType && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.itemType}
                    </motion.p>
                  )}
                </motion.div>

                {/* Budget Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 }}
                >
                  <label
                    htmlFor="budget"
                    className="block text-sm font-semibold text-ocean-700 mb-2"
                  >
                    Budget Range (Optional)
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-ocean-200 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all"
                    placeholder="e.g., $50-100, $200+"
                  />
                </motion.div>

                {/* Description Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-ocean-700 mb-2"
                  >
                    Design Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all resize-none ${
                      errors.description
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-ocean-200'
                    }`}
                    placeholder="Describe your design ideas, materials, colors, size preferences, or any special requests..."
                  />
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.description}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Status */}
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-700 border-2 border-green-200'
                        : 'bg-red-50 text-red-700 border-2 border-red-200'
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full relative overflow-hidden group"
                    disabled={isSubmitting}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'Submitting...' : 'Submit Design Request'}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-seafoam-400 to-ocean-500"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>

                <p className="text-sm text-ocean-500 text-center">
                  We&apos;ll review your design and contact you within 24-48
                  hours
                </p>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Information */}
          <motion.div
            ref={infoRef}
            initial="hidden"
            animate={infoInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Process Information */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-8 shadow-xl border border-ocean-100"
            >
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-6">
                How It Works
              </h3>

              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Upload Your Design',
                    description:
                      'Share a photo of your inspiration, sketch, or any reference image that captures what you envision.',
                  },
                  {
                    step: '2',
                    title: 'We Review & Connect',
                    description:
                      "Our artisans will review your design and reach out within 24-48 hours to discuss details, materials, and pricing.",
                  },
                  {
                    step: '3',
                    title: 'Crafting Your Piece',
                    description:
                      "Once approved, we'll handcraft your custom piece with the same ocean-inspired quality you love from our collection.",
                  },
                  {
                    step: '4',
                    title: 'Delivery & Delight',
                    description:
                      'Your unique piece will be carefully packaged and shipped to you, ready to make waves!',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={infoInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-ocean-500 to-seafoam-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white text-xl font-bold">
                        {item.step}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-ocean-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-ocean-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Pricing Information */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-white to-seafoam-50 rounded-3xl p-8 shadow-xl border border-ocean-100"
            >
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-4">
                Custom Design Pricing
              </h3>
              <p className="text-ocean-600 mb-6">
                Every custom piece is unique, so pricing varies based on:
              </p>

              <div className="space-y-3">
                {[
                  'Materials & gemstones used',
                  'Complexity of the design',
                  'Size and dimensions',
                  'Special techniques required',
                  'Timeline and rush orders',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={infoInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center"
                  >
                    <span className="text-ocean-500 mr-3 text-xl">•</span>
                    <span className="text-ocean-700">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-6 p-4 bg-gradient-to-r from-ocean-50 to-seafoam-50 rounded-2xl border-2 border-ocean-100"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-ocean-700">
                  <span className="text-lg">💡</span>{' '}
                  <strong>Pro Tip:</strong> Most custom pieces range from
                  $75-$300. We&apos;ll provide a detailed quote after reviewing
                  your design.
                </p>
              </motion.div>
            </motion.div>

            {/* Ocean Conservation */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-seafoam-400 to-ocean-500 rounded-3xl p-8 shadow-xl text-white"
            >
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🌊</span>
                <h3 className="text-2xl font-display font-bold">
                  Ocean Conservation
                </h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                Every custom piece includes our commitment to the ocean! We
                donate 10% of all proceeds to marine conservation organizations
                protecting our precious ocean ecosystems.
              </p>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-8 shadow-xl border border-ocean-100"
            >
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-4">
                Questions?
              </h3>
              <p className="text-ocean-600 mb-6">
                We&apos;re here to help bring your vision to life!
              </p>

              <div className="space-y-4">
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-2xl mr-3">📧</span>
                  <div>
                    <p className="text-sm text-ocean-500 font-medium">Email</p>
                    <p className="text-ocean-800 font-semibold">
                      shenna@shennastudio.com
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-2xl mr-3">📱</span>
                  <div>
                    <p className="text-sm text-ocean-500 font-medium">Phone</p>
                    <p className="text-ocean-800 font-semibold">
                      (956) 555-WAVE
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
