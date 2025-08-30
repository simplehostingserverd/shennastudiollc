import { algoliasearch } from 'algoliasearch';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error('❌ Missing Algolia credentials in environment variables');
  process.exit(1);
}

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

interface MedusaProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  status: string;
  images: Array<{ url: string; alt?: string }>;
  variants: Array<{
    id: string;
    title: string;
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
    options: Record<string, string>;
  }>;
  categories?: Array<{ id: string; name: string }>;
  tags?: Array<{ id: string; value: string }>;
  created_at: string;
  updated_at: string;
}

interface AlgoliaRecord extends Record<string, unknown> {
  objectID: string;
  title: string;
  description: string;
  handle: string;
  image: string;
  price: number;
  currency: string;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    currency: string;
    options: Record<string, string>;
  }>;
  categories: string[];
  tags: string[];
  status: string;
  created_at: number;
}

// Fetch products from Medusa backend with hardcoded sample data for now
const fetchMedusaProducts = async (): Promise<MedusaProduct[]> => {
  try {
    console.log(`🔍 Creating sample ocean-themed products for indexing...`);
    
    // For now, let's create sample products that match our ocean theme
    // In a real implementation, you'd fetch these from your Medusa backend
    const sampleProducts: MedusaProduct[] = [
      {
        id: 'prod_ocean_turtle_mug',
        title: 'Ocean Turtle Ceramic Mug',
        description: 'Beautiful ceramic mug featuring a majestic sea turtle design. Perfect for your morning coffee while supporting ocean conservation.',
        handle: 'ocean-turtle-ceramic-mug',
        status: 'published',
        images: [{ url: '/images/turtle-mug.jpg', alt: 'Sea Turtle Mug' }],
        variants: [{
          id: 'variant_turtle_mug_default',
          title: 'Default',
          prices: [{ amount: 2499, currency_code: 'usd' }],
          options: { size: 'Standard', color: 'Ocean Blue' }
        }],
        categories: [{ id: 'cat_drinkware', name: 'Mugs & Drinkware' }],
        tags: [{ id: 'tag_turtle', value: 'turtle' }, { id: 'tag_ocean', value: 'ocean' }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'prod_coral_necklace',
        title: 'Coral-Inspired Statement Necklace',
        description: 'Elegant necklace inspired by beautiful coral formations. A stunning piece that celebrates marine biodiversity.',
        handle: 'coral-inspired-statement-necklace',
        status: 'published',
        images: [{ url: '/images/coral-necklace.jpg', alt: 'Coral Necklace' }],
        variants: [{
          id: 'variant_coral_necklace_default',
          title: 'Default',
          prices: [{ amount: 8999, currency_code: 'usd' }],
          options: { material: 'Sterling Silver', style: 'Statement' }
        }],
        categories: [{ id: 'cat_jewelry', name: 'Jewelry' }],
        tags: [{ id: 'tag_coral', value: 'coral' }, { id: 'tag_jewelry', value: 'jewelry' }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'prod_shell_necklace',
        title: 'Natural Shell Pendant Necklace',
        description: 'Delicate necklace featuring authentic ocean shells. Each piece is unique, just like the treasures found on the beach.',
        handle: 'natural-shell-pendant-necklace',
        status: 'published',
        images: [{ url: '/images/shell-necklace.jpg', alt: 'Shell Necklace' }],
        variants: [{
          id: 'variant_shell_necklace_default',
          title: 'Default',
          prices: [{ amount: 5999, currency_code: 'usd' }],
          options: { material: 'Natural Shell', chain: 'Silver' }
        }],
        categories: [{ id: 'cat_jewelry', name: 'Jewelry' }],
        tags: [{ id: 'tag_shell', value: 'shell' }, { id: 'tag_natural', value: 'natural' }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'prod_ocean_poster',
        title: 'Ocean Conservation Art Poster',
        description: 'Inspiring poster featuring ocean conservation messaging and beautiful marine life artwork. Perfect for any space.',
        handle: 'ocean-conservation-art-poster',
        status: 'published',
        images: [{ url: '/images/ocean-poster.jpg', alt: 'Ocean Poster' }],
        variants: [{
          id: 'variant_ocean_poster_default',
          title: 'Default',
          prices: [{ amount: 3999, currency_code: 'usd' }],
          options: { size: '18x24 inches', material: 'High-quality Print' }
        }],
        categories: [{ id: 'cat_art', name: 'Art & Prints' }],
        tags: [{ id: 'tag_conservation', value: 'conservation' }, { id: 'tag_art', value: 'art' }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    console.log(`✅ Created ${sampleProducts.length} sample products for indexing`);
    
    return sampleProducts;
  } catch (error) {
    console.error('❌ Error creating sample products:', error);
    throw error;
  }
};

// Transform Medusa product to Algolia record
const transformProductForAlgolia = (product: MedusaProduct): AlgoliaRecord => {
  // Get the first variant and its price
  const firstVariant = product.variants?.[0];
  const firstPrice = firstVariant?.prices?.[0];
  
  return {
    objectID: product.id,
    title: product.title,
    description: product.description || '',
    handle: product.handle,
    image: product.images?.[0]?.url || '',
    price: firstPrice ? firstPrice.amount / 100 : 0, // Convert from cents
    currency: firstPrice?.currency_code?.toUpperCase() || 'USD',
    variants: product.variants?.map(variant => ({
      id: variant.id,
      title: variant.title,
      price: variant.prices?.[0] ? variant.prices[0].amount / 100 : 0,
      currency: variant.prices?.[0]?.currency_code?.toUpperCase() || 'USD',
      options: variant.options || {}
    })) || [],
    categories: product.categories?.map(cat => cat.name) || [],
    tags: product.tags?.map(tag => tag.value) || [],
    status: product.status,
    created_at: new Date(product.created_at).getTime()
  };
};

// Index products in Algolia
const indexProducts = async () => {
  try {
    console.log('🚀 Starting Algolia indexing process...');
    
    // Fetch products from Medusa
    const products = await fetchMedusaProducts();
    
    if (products.length === 0) {
      console.log('⚠️  No products found to index');
      return;
    }
    
    // Transform products for Algolia
    const algoliaRecords = products
      .filter(product => product.status === 'published') // Only index published products
      .map(transformProductForAlgolia);
    
    console.log(`🔄 Indexing ${algoliaRecords.length} published products...`);
    
    // Clear existing index and add new records
    console.log('🔄 Indexing products in Algolia...');
    
    // Clear the index first and add new records
    const result = await algoliaClient.replaceAllObjects({ 
      indexName: 'products', 
      objects: algoliaRecords 
    });
    
    console.log('✅ Products successfully indexed in Algolia!');
    console.log(`📊 Indexed ${algoliaRecords.length} products`);
    console.log('🎉 Algolia indexing completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during indexing process:', error);
    throw error;
  }
};

// Run the indexing process
indexProducts()
  .then(() => {
    console.log('✨ All done! Your products are now searchable in Algolia.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Indexing failed:', error);
    process.exit(1);
  });