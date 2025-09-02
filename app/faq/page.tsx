"use client"

import { useState } from "react"
import Button from "@/app/components/ui/Button"
import Link from "next/link"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: "Shipping",
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days. All orders are processed within 1-2 business days."
  },
  {
    category: "Shipping",
    question: "Do you offer free shipping?",
    answer: "Yes! We offer free standard shipping on all orders over $75. Express shipping is available for $12.99."
  },
  {
    category: "Products",
    question: "Are your products really ocean-themed?",
    answer: "Absolutely! Every item in our collection is carefully designed to celebrate marine life and ocean conservation. We&apos;re passionate about bringing the beauty of the ocean into your daily life."
  },
  {
    category: "Products",
    question: "How do I care for my ocean treasures?",
    answer: "Each product comes with specific care instructions. Generally, we recommend gentle cleaning with mild soap and water, and avoiding harsh chemicals to preserve the ocean-inspired materials."
  },
  {
    category: "Orders",
    question: "Can I modify or cancel my order?",
    answer: "You can modify or cancel your order within 2 hours of placing it. After that, your order enters our fulfillment process. Please contact us immediately if you need to make changes."
  },
  {
    category: "Orders",
    question: "How can I track my order?",
    answer: "Once your order ships, you&apos;ll receive a tracking number via email. You can use this to track your package on our shipping partner&apos;s website."
  },
  {
    category: "Returns",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all items in original condition. Returns are easy and we provide prepaid shipping labels for your convenience."
  },
  {
    category: "Returns",
    question: "How long do refunds take?",
    answer: "Refunds are processed within 3-5 business days of receiving your returned item. You&apos;ll see the credit appear on your original payment method within 7-10 business days."
  },
  {
    category: "Conservation",
    question: "How does my purchase support ocean conservation?",
    answer: "We donate 10% of all proceeds to marine conservation organizations. Every purchase directly contributes to protecting ocean ecosystems and marine wildlife."
  },
  {
    category: "Conservation",
    question: "Which conservation organizations do you support?",
    answer: "We partner with several respected marine conservation organizations including Ocean Conservancy, Surfrider Foundation, and local marine protection groups."
  }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const categories = ["All", ...Array.from(new Set(faqData.map(item => item.category)))]

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <div className="min-h-screen bg-ocean-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-ocean-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-ocean-600">
            Find answers to common questions about our ocean treasures
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-ocean-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto px-4 py-3 border border-ocean-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => {
              const isExpanded = expandedItems.has(index)
              return (
                <div key={index} className="border border-ocean-200 rounded-lg">
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full text-left px-6 py-4 hover:bg-ocean-50 focus:outline-none focus:bg-ocean-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="inline-block px-2 py-1 bg-ocean-100 text-ocean-700 text-xs rounded-full mb-2">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-semibold text-ocean-900">
                          {item.question}
                        </h3>
                      </div>
                      <div className="text-ocean-500">
                        {isExpanded ? "−" : "+"}
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-4">
                      <p className="text-ocean-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-ocean-500">No FAQs found matching your search.</p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-ocean-900 mb-4">
            Still Need Help?
          </h2>
          <p className="text-ocean-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Contact Support
              </Button>
            </Link>
            <Link href="mailto:support@shennastudio.com">
              <Button variant="outline" size="lg">
                Email Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
