import React from 'react'
import Link from 'next/link'
import { HeartIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function ConservationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-ocean-gradient py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Ocean Conservation
          </h1>
          <p className="text-xl md:text-2xl text-ocean-100 max-w-3xl mx-auto leading-relaxed">
            Protecting the sea turtles and marine life of South Padre Island, Texas
          </p>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-ocean-waves opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Our Mission */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Our Conservation Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Shenna&apos;s Studio, we&apos;re passionate about protecting the incredible marine ecosystem 
              that surrounds South Padre Island, especially the magnificent sea turtles that call our waters home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-ocean-100">
              <HeartIcon className="h-12 w-12 text-ocean-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Love for Marine Life</h3>
              <p className="text-gray-600">
                Every sea turtle that nests on our beautiful beaches inspires our dedication to conservation efforts.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-ocean-100">
              <GlobeAltIcon className="h-12 w-12 text-ocean-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Impact</h3>
              <p className="text-gray-600">
                10% of every purchase goes directly to ocean conservation organizations working to protect marine habitats.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-ocean-100">
              <ShieldCheckIcon className="h-12 w-12 text-ocean-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Protected Future</h3>
              <p className="text-gray-600">
                Supporting research and protection programs that ensure sea turtles thrive for generations to come.
              </p>
            </div>
          </div>
        </section>

        {/* South Padre Island */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-ocean-400 to-ocean-500 rounded-3xl p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  South Padre Island, Texas
                </h2>
                <p className="text-ocean-100 text-lg mb-6 leading-relaxed">
                  Our home on South Padre Island places us at the heart of one of Texas&apos;s most important 
                  sea turtle nesting areas. Every year, we witness the miracle of Kemp&apos;s ridley, loggerhead, 
                  and green sea turtles returning to our shores to nest.
                </p>
                <p className="text-ocean-100 text-lg leading-relaxed">
                  This incredible natural phenomenon drives our passion for conservation and reminds us 
                  daily why protecting our oceans is so crucial.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6">Sea Turtle Species We Protect</h3>
                <ul className="space-y-3 text-ocean-100">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Kemp&apos;s Ridley Sea Turtle (Critically Endangered)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Loggerhead Sea Turtle (Vulnerable)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Green Sea Turtle (Endangered)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Hawksbill Sea Turtle (Critically Endangered)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              How We Make a Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every purchase you make helps fund critical conservation efforts and research programs 
              dedicated to protecting sea turtles and marine ecosystems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-ocean-100">
              <div className="text-3xl font-bold text-ocean-500 mb-2">10%</div>
              <h4 className="font-bold text-gray-900 mb-2">Of Every Sale</h4>
              <p className="text-gray-600 text-sm">Goes directly to ocean conservation organizations</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-ocean-100">
              <div className="text-3xl font-bold text-ocean-500 mb-2">24/7</div>
              <h4 className="font-bold text-gray-900 mb-2">Beach Monitoring</h4>
              <p className="text-gray-600 text-sm">Supporting turtle patrol and nesting site protection</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-ocean-100">
              <div className="text-3xl font-bold text-ocean-500 mb-2">365</div>
              <h4 className="font-bold text-gray-900 mb-2">Days a Year</h4>
              <p className="text-gray-600 text-sm">Funding rescue and rehabilitation programs</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-ocean-100">
              <div className="text-3xl font-bold text-ocean-500 mb-2">∞</div>
              <h4 className="font-bold text-gray-900 mb-2">Future Generations</h4>
              <p className="text-gray-600 text-sm">Ensuring sea turtles thrive for years to come</p>
            </div>
          </div>
        </section>

        {/* Conservation Partners */}
        <section className="mb-20">
          <div className="bg-ocean-50 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Our Conservation Partners
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We work alongside dedicated organizations committed to sea turtle conservation 
                and marine ecosystem protection in the Gulf of Mexico.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Sea Turtle Inc.
                </h3>
                <p className="text-gray-600 mb-4">
                  The world&apos;s largest sea turtle facility, located right here on South Padre Island, 
                  dedicated to rescue, rehabilitation, and release of sea turtles.
                </p>
                <div className="text-ocean-500 font-semibold">South Padre Island, TX</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Coastal Conservation Association
                </h3>
                <p className="text-gray-600 mb-4">
                  Working to advance the conservation of our coastal marine resources through 
                  habitat protection, water quality improvement, and marine life conservation.
                </p>
                <div className="text-ocean-500 font-semibold">Gulf Coast Region</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Join Our Conservation Mission
            </h2>
            <p className="text-ocean-100 text-lg mb-8 max-w-2xl mx-auto">
              Every purchase helps protect the sea turtles we love. Shop our ocean-inspired collection 
              and make a difference for marine conservation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="bg-white text-ocean-600 px-8 py-4 rounded-full font-semibold hover:bg-ocean-50 transition-colors"
              >
                Shop for Conservation
              </Link>
              <Link 
                href="/about" 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-ocean-600 transition-colors"
              >
                Learn Our Story
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}