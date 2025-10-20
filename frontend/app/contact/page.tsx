'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Button from '@/app/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Shenna\'s Studio | Ocean Products Customer Service',
  description: 'Contact Shenna\'s Studio for questions about ocean-themed products, orders, or marine conservation. Located in Brownsville, Texas. Email: shenna@shennastudio.com',
  keywords: 'contact Shenna Studio, customer service, ocean products support, Brownsville Texas studio, email contact',
  openGraph: {
    title: 'Contact Shenna\'s Studio',
    description: 'Get in touch with our team for questions about ocean products and orders.',
    url: 'https://shennastudio.com/contact',
    type: 'website'
  },
  alternates: {
    canonical: '/contact'
  }
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  recaptcha?: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // Animation refs
  const headerRef = useRef(null)
  const formRef = useRef(null)
  const infoRef = useRef(null)

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
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

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
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

    // For now, show a message directing users to email directly
    setTimeout(() => {
      setSubmitStatus({
        type: 'success',
        message: 'Please email us directly at shenna@shennastudio.com - our contact form is temporarily unavailable.',
      })
      setIsSubmitting(false)
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
              Contact Us
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-display font-bold text-ocean-900 mb-6"
          >
            Let&apos;s Start a{' '}
            <span className="bg-gradient-to-r from-ocean-600 to-seafoam-500 bg-clip-text text-transparent">
              Conversation
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-ocean-600 max-w-3xl mx-auto leading-relaxed"
          >
            We&apos;d love to hear from you! Whether you have questions about
            our ocean-inspired products, need help with an order, or want to
            learn more about our conservation efforts.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Animated Contact Form */}
          <motion.div
            ref={formRef}
            initial="hidden"
            animate={formInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-ocean-100"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-display font-bold text-ocean-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-ocean-600 mb-8">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>
            </motion.div>

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

              {/* Subject Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-ocean-700 mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all ${
                    errors.subject
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-ocean-200'
                  }`}
                  placeholder="How can we help?"
                />
                {errors.subject && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.subject}
                  </motion.p>
                )}
              </motion.div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-ocean-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-ocean-100 focus:border-ocean-500 transition-all resize-none ${
                    errors.message
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-ocean-200'
                  }`}
                  placeholder="Tell us more about how we can help you..."
                />
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.message}
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
                transition={{ delay: 0.8 }}
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
                    {isSubmitting ? 'Sending...' : 'Send Message'}
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
                Or email us directly at shenna@shennastudio.com
              </p>
            </form>
          </motion.div>

          {/* Animated Contact Information */}
          <motion.div
            ref={infoRef}
            initial="hidden"
            animate={infoInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Studio Location */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-8 shadow-xl border border-ocean-100 transition-all"
            >
              <motion.div
                className="flex items-center mb-4"
                whileHover={{ x: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-ocean-500 to-seafoam-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-2xl">📍</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-ocean-900">
                  Visit Our Studio
                </h3>
              </motion.div>
              <div className="text-ocean-600 space-y-2 ml-18">
                <p className="font-bold text-ocean-800">Shenna&apos;s Studio</p>
                <p>2436 Pablo Kisel Boulevard</p>
                <p>Brownsville, Texas 78526</p>
              </div>
            </motion.div>

            {/* Contact Methods */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-white to-seafoam-50 rounded-3xl p-8 shadow-xl border border-ocean-100"
            >
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-6">
                Other Ways to Reach Us
              </h3>

              <div className="space-y-6">
                <motion.div
                  className="flex items-center group cursor-pointer"
                  whileHover={{ x: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-coral-100 to-coral-50 rounded-2xl flex items-center justify-center mr-4 group-hover:shadow-lg transition-shadow">
                    <span className="text-coral-600 text-xl">📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-ocean-500 font-medium">Email</p>
                    <p className="text-ocean-800 font-semibold text-lg">
                      shenna@shennastudio.com
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center group cursor-pointer"
                  whileHover={{ x: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-seafoam-100 to-seafoam-50 rounded-2xl flex items-center justify-center mr-4 group-hover:shadow-lg transition-shadow">
                    <span className="text-seafoam-600 text-xl">📱</span>
                  </div>
                  <div>
                    <p className="text-sm text-ocean-500 font-medium">Phone</p>
                    <p className="text-ocean-800 font-semibold text-lg">
                      (956) 555-WAVE
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center group cursor-pointer"
                  whileHover={{ x: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-ocean-100 to-ocean-50 rounded-2xl flex items-center justify-center mr-4 group-hover:shadow-lg transition-shadow">
                    <span className="text-ocean-600 text-xl">💬</span>
                  </div>
                  <div>
                    <p className="text-sm text-ocean-500 font-medium">
                      Social Media
                    </p>
                    <p className="text-ocean-800 font-semibold text-lg">
                      @shennasstudio
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-8 shadow-xl border border-ocean-100"
            >
              <h3 className="text-2xl font-display font-bold text-ocean-900 mb-6">
                Studio Hours
              </h3>

              <div className="space-y-4 text-ocean-700">
                <motion.div
                  className="flex justify-between items-center py-2 border-b border-ocean-100"
                  whileHover={{ x: 5 }}
                >
                  <span className="font-medium">Monday - Friday</span>
                  <span className="font-bold">9:00 AM - 6:00 PM</span>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center py-2 border-b border-ocean-100"
                  whileHover={{ x: 5 }}
                >
                  <span className="font-medium">Saturday</span>
                  <span className="font-bold">10:00 AM - 4:00 PM</span>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center py-2"
                  whileHover={{ x: 5 }}
                >
                  <span className="font-medium">Sunday</span>
                  <span className="font-bold">By Appointment</span>
                </motion.div>
              </div>

              <motion.div
                className="mt-6 p-4 bg-gradient-to-r from-ocean-50 to-seafoam-50 rounded-2xl border-2 border-ocean-100"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-ocean-700">
                  <span className="text-lg">💡</span>{' '}
                  <strong>Pro Tip:</strong> Call ahead for studio visits to
                  ensure we&apos;re available to give you our full attention!
                </p>
              </motion.div>
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
                Every purchase supports our mission! We donate 10% of all
                proceeds to marine conservation organizations protecting our
                precious ocean ecosystems.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gradient-to-br from-white to-ocean-50 rounded-3xl p-10 shadow-2xl border border-ocean-100"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-ocean-900 mb-10 text-center"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'Do you ship internationally?',
                a: "Currently, we ship within the United States. We're working on international shipping options and hope to expand soon!",
              },
              {
                q: 'How do you support ocean conservation?',
                a: 'We donate 10% of all proceeds to marine conservation organizations that work to protect our precious ocean ecosystems.',
              },
              {
                q: 'Can I visit your studio?',
                a: 'Absolutely! We love welcoming visitors to our studio. Please call ahead to schedule a visit so we can ensure someone is available to assist you.',
              },
              {
                q: 'Do you offer custom designs?',
                a: "Yes! We love creating custom pieces. Contact us to discuss your ideas and we'll work together to create something uniquely yours.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-ocean-100 transition-all"
              >
                <h3 className="text-lg font-bold text-ocean-900 mb-3 flex items-start">
                  <span className="text-ocean-500 mr-2">Q:</span>
                  {faq.q}
                </h3>
                <p className="text-ocean-600 leading-relaxed pl-6">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
