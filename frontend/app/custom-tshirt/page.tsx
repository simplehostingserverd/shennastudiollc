'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Button from '@/app/components/ui/Button'
import Image from 'next/image'

interface FormData {
  name: string
  email: string
  phone: string
  size: string
  quantity: string
  description: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  size?: string
  quantity?: string
  description?: string
  image?: string
}

export default function CustomTshirtPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    size: '',
    quantity: '',
    description: '',
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
  const mockupRef = useRef(null)
  const formRef = useRef(null)
  const infoRef = useRef(null)

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
  const mockupInView = useInView(mockupRef, { once: true, amount: 0.2 })
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
    } else if (
      !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
        formData.phone
      )
    ) {
      newErrors.phone = 'Invalid phone number (use format: 123-456-7890)'
    }

    if (!formData.size) {
      newErrors.size = 'Please select a size'
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Please specify quantity'
    } else if (parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
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
          "Thank you for your custom t-shirt request! Please email your design photo and details to shenna@shennastudio.com and we'll get back to you within 24 hours with pricing and timeline.",
      })
      setIsSubmitting(false)
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        size: '',
        quantity: '',
        description: '',
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
              Custom T-Shirt Design
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-display font-bold text-ocean-900 mb-6"
          >
            Design Your{' '}
            <span className="bg-gradient-to-r from-ocean-600 to-seafoam-500 bg-clip-text text-transparent">
              Perfect Tee
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-ocean-600 max-w-3xl mx-auto leading-relaxed"
          >
            Upload your design and see it come to life on a premium white
            t-shirt. Perfect for events, teams, or expressing your unique style.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Mockup and Upload */}
          <div className="space-y-8">
            {/* T-Shirt Mockup */}
            <motion.div
              ref={mockupRef}
              initial="hidden"
              animate={mockupInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-8 md:p-10 shadow-2xl border border-ocean-100"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={mockupInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-display font-bold text-ocean-900 mb-2">
                  Design Preview
                </h2>
                <p className="text-ocean-600 mb-6">
                  See your design on a white t-shirt mockup
                </p>
              </motion.div>

              {/* T-Shirt Mockup Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={mockupInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="relative w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden flex items-center justify-center"
              >
                {/* White T-Shirt Background */}
                <div className="relative w-4/5 h-4/5 bg-white rounded-lg shadow-xl flex items-center justify-center">
                  {/* Design Overlay Area */}
                  <div className="relative w-3/4 h-3/4 border-2 border-dashed border-ocean-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Your design"
                        width={400}
                        height={400}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-4xl mb-2 block">👕</span>
                        <p className="text-ocean-500 text-sm">
                          Your design will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* T-Shirt Mockup Overlay (subtle shirt outline) */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full h-full opacity-10"
                    fill="none"
                    stroke="currentColor"
                  >
                    {/* Simple T-shirt outline */}
                    <path
                      d="M120 80 L80 120 L80 400 L320 400 L320 120 L280 80 L260 100 L260 80 L140 80 L140 100 Z"
                      strokeWidth="2"
                      fill="rgba(0,0,0,0.05)"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Upload Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={mockupInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {!imagePreview ? (
                  <motion.button
                    onClick={handleImageClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-ocean-500 to-seafoam-400 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="text-2xl mr-2">📸</span>
                    Upload Your Design
                  </motion.button>
                ) : (
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handleImageClick}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-ocean-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Change Design
                    </motion.button>
                    <motion.button
                      onClick={handleRemoveImage}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Remove
                    </motion.button>
                  </div>
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

            {/* Order Information */}
            <motion.div
              ref={formRef}
              initial="hidden"
              animate={formInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-ocean-100"
            >
              <h2 className="text-3xl font-display font-bold text-ocean-900 mb-2">
                Order Details
              </h2>
              <p className="text-ocean-600 mb-8">
                Fill out your information and preferences
              </p>

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

                {/* Size Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <label
                    htmlFor="size"
                    className="block text-sm font-semibold text-ocean-700 mb-2"
                  >
                    T-Shirt Size *
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all ${
                      errors.size
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-ocean-200'
                    }`}
                  >
                    <option value="">Select size...</option>
                    <option value="xs">XS - Extra Small</option>
                    <option value="s">S - Small</option>
                    <option value="m">M - Medium</option>
                    <option value="l">L - Large</option>
                    <option value="xl">XL - Extra Large</option>
                    <option value="2xl">2XL - 2X Large</option>
                    <option value="3xl">3XL - 3X Large</option>
                  </select>
                  {errors.size && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.size}
                    </motion.p>
                  )}
                </motion.div>

                {/* Quantity Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 }}
                >
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-semibold text-ocean-700 mb-2"
                  >
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all ${
                      errors.quantity
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-ocean-200'
                    }`}
                    placeholder="How many shirts?"
                  />
                  {errors.quantity && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.quantity}
                    </motion.p>
                  )}
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
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-ocean-200 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all resize-none"
                    placeholder="Any special requests, placement preferences, or design details..."
                  />
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
                      {isSubmitting ? 'Submitting...' : 'Submit T-Shirt Order'}
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
                  We&apos;ll review your design and contact you within 24 hours
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
            {/* Product Information */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-8 shadow-xl border border-ocean-100"
            >
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-6">
                Premium Quality
              </h3>

              <div className="space-y-4">
                {[
                  {
                    icon: '👕',
                    title: '100% Cotton',
                    description: 'Soft, breathable, and comfortable all day',
                  },
                  {
                    icon: '🎨',
                    title: 'High-Quality Print',
                    description: 'Vibrant colors that last wash after wash',
                  },
                  {
                    icon: '📏',
                    title: 'Perfect Fit',
                    description: 'Available in sizes XS to 3XL',
                  },
                  {
                    icon: '♻️',
                    title: 'Eco-Friendly',
                    description: 'Sustainable printing process',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={infoInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-ocean-100 to-seafoam-50 rounded-2xl flex items-center justify-center mr-4">
                      <span className="text-2xl">{item.icon}</span>
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
                Pricing
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-ocean-100">
                  <span className="text-ocean-700 font-medium">
                    1-5 shirts
                  </span>
                  <span className="text-ocean-900 font-bold">$25 each</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-ocean-100">
                  <span className="text-ocean-700 font-medium">
                    6-11 shirts
                  </span>
                  <span className="text-ocean-900 font-bold">$22 each</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-ocean-100">
                  <span className="text-ocean-700 font-medium">
                    12+ shirts
                  </span>
                  <span className="text-ocean-900 font-bold">$20 each</span>
                </div>
              </div>

              <motion.div
                className="p-4 bg-gradient-to-r from-ocean-50 to-seafoam-50 rounded-2xl border-2 border-ocean-100"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-ocean-700">
                  <span className="text-lg">💡</span>{' '}
                  <strong>Bulk Discount:</strong> Order 12 or more for the best
                  price!
                </p>
              </motion.div>
            </motion.div>

            {/* Design Guidelines */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-8 shadow-xl border border-ocean-100"
            >
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-4">
                Design Guidelines
              </h3>

              <div className="space-y-3">
                {[
                  'High-resolution images (300 DPI minimum)',
                  'PNG or JPG format accepted',
                  'Transparent background works best',
                  'Design area: 12" x 12" maximum',
                  'Single color or full color available',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={infoInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center"
                  >
                    <span className="text-ocean-500 mr-3 text-xl">✓</span>
                    <span className="text-ocean-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ocean Conservation */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.3 }}
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
                Every custom t-shirt purchase supports our ocean conservation
                efforts! We donate 10% of proceeds to marine protection
                organizations.
              </p>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-8 shadow-xl border border-ocean-100"
            >
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-4">
                Questions?
              </h3>

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
