"use client"

import Button from "@/app/components/ui/Button"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ocean-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-ocean-600 max-w-2xl mx-auto">
            We&apos;d love to hear from you! Whether you have questions about our products, 
            need help with an order, or just want to say hello.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-display font-bold text-ocean-900 mb-6">
              Send Us a Message
            </h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ocean-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-ocean-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ocean-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-ocean-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-ocean-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-ocean-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ocean-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-ocean-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
                  placeholder="Tell us more about how we can help you..."
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Studio Location */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-ocean-gradient rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📍</span>
                </div>
                <h3 className="text-xl font-display font-bold text-ocean-900">
                  Visit Our Studio
                </h3>
              </div>
              <div className="text-ocean-600 space-y-1">
                <p className="font-semibold">Shenna&apos;s Studio</p>
                <p>2436 Pablo Kisel Boulevard</p>
                <p>Brownsville, Texas 78526</p>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-display font-bold text-ocean-900 mb-6">
                Other Ways to Reach Us
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-coral-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-coral-600">📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-ocean-500">Email</p>
                    <p className="text-ocean-700 font-medium">hello@shennasstudio.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-seafoam-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-seafoam-600">📱</span>
                  </div>
                  <div>
                    <p className="text-sm text-ocean-500">Phone</p>
                    <p className="text-ocean-700 font-medium">(956) 555-WAVE</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-ocean-600">💬</span>
                  </div>
                  <div>
                    <p className="text-sm text-ocean-500">Social Media</p>
                    <p className="text-ocean-700 font-medium">@shennasstudio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-display font-bold text-ocean-900 mb-6">
                Studio Hours
              </h3>
              
              <div className="space-y-3 text-ocean-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">By Appointment</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-ocean-50 rounded-lg">
                <p className="text-sm text-ocean-600">
                  💡 <strong>Tip:</strong> Call ahead for studio visits to ensure we&apos;re available 
                  to give you our full attention!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-display font-bold text-ocean-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-ocean-900 mb-2">
                Do you ship internationally?
              </h3>
              <p className="text-ocean-600">
                Currently, we ship within the United States. We&apos;re working on international 
                shipping options and hope to expand soon!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ocean-900 mb-2">
                How do you support ocean conservation?
              </h3>
              <p className="text-ocean-600">
                We donate 10% of all proceeds to marine conservation organizations 
                that work to protect our precious ocean ecosystems.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ocean-900 mb-2">
                Can I visit your studio?
              </h3>
              <p className="text-ocean-600">
                Absolutely! We love welcoming visitors to our studio. Please call ahead 
                to schedule a visit so we can ensure someone is available to assist you.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ocean-900 mb-2">
                Do you offer custom designs?
              </h3>
              <p className="text-ocean-600">
                Yes! We love creating custom pieces. Contact us to discuss your ideas 
                and we&apos;ll work together to create something uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}