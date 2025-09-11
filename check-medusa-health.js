#!/usr/bin/env node

import https from 'https'
import http from 'http'

const checkEndpoint = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http
    const req = protocol.get(url, (res) => {
      console.log(`✅ ${url}: ${res.statusCode} ${res.statusMessage}`)
      resolve({ url, status: res.statusCode, success: true })
    })
    
    req.on('error', (err) => {
      console.log(`❌ ${url}: ${err.message}`)
      resolve({ url, error: err.message, success: false })
    })
    
    req.setTimeout(5000, () => {
      req.destroy()
      console.log(`⏰ ${url}: Timeout after 5 seconds`)
      resolve({ url, error: 'Timeout', success: false })
    })
  })
}

async function checkMedusaHealth() {
  console.log('🔍 Checking Medusa Backend Health...\n')
  
  const endpoints = [
    'https://api.shennastudio.com/health',
    'https://api.shennastudio.com:9000/health',
    'https://api.shennastudio.com/app/',
    'https://api.shennastudio.com:7001/app/',
    'https://api.shennastudio.com:7001/'
  ]
  
  const results = await Promise.all(endpoints.map(checkEndpoint))
  
  console.log('\n📊 Summary:')
  const working = results.filter(r => r.success)
  const failing = results.filter(r => !r.success)
  
  console.log(`✅ Working: ${working.length}/${results.length}`)
  console.log(`❌ Failing: ${failing.length}/${results.length}`)
  
  if (working.length > 0) {
    console.log('\n🎯 Try these URLs for admin access:')
    working.forEach(r => {
      if (r.url.includes('/app/')) {
        console.log(`   ${r.url}`)
      }
    })
  }
}

checkMedusaHealth().catch(console.error)