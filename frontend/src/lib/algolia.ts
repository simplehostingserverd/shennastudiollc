import { algoliasearch } from 'algoliasearch'

// Use actual Algolia credentials from environment variables
const ALGOLIA_APP_ID =
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID || 'XN8AAM6C2P'
const ALGOLIA_API_KEY =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ||
  '307bdad52d454f71699a996607f0433d'

export const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

// Note: For Algolia v5, we'll need to handle search differently in components
