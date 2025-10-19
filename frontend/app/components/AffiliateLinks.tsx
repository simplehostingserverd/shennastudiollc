'use client'

import { useState, useEffect } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

interface AffiliateLink {
  id: string
  title: string
  url: string
  description: string | null
}

interface AffiliateLinksProps {
  placement: string
  className?: string
}

export default function AffiliateLinks({
  placement,
  className = '',
}: AffiliateLinksProps) {
  const [links, setLinks] = useState<AffiliateLink[]>([])

  useEffect(() => {
    fetchLinks()
  }, [placement])

  const fetchLinks = async () => {
    try {
      const response = await fetch(`/api/affiliates?placement=${placement}`)
      const data = await response.json()
      setLinks(data.affiliates || [])
    } catch (error) {
      console.error('Error fetching affiliate links:', error)
    }
  }

  const trackClick = async (id: string) => {
    try {
      await fetch('/api/affiliates/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliateId: id }),
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  if (links.length === 0) return null

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-blue-900">
        Recommended Products
      </h3>
      <div className="space-y-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackClick(link.id)}
            className="block bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 group-hover:text-blue-600 transition-colors">
                  {link.title}
                </h4>
                {link.description && (
                  <p className="text-sm text-blue-600 mt-1">
                    {link.description}
                  </p>
                )}
              </div>
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-blue-400 ml-2 flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
