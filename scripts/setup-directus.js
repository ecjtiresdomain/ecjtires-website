/**
 * ECJ Tires - Directus Collection Setup Script
 * This script creates all necessary collections and fields in Directus
 */

const DIRECTUS_URL = 'https://directus-production-6c1b.up.railway.app';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

async function apiRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${DIRECTUS_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function collectionExists(name) {
  try {
    await apiRequest(`/collections/${name}`);
    return true;
  } catch {
    return false;
  }
}

async function createCollection(collection, fields, meta = {}) {
  const name = collection;

  if (await collectionExists(name)) {
    console.log(`  ⏭️  Collection "${name}" already exists, skipping...`);
    return;
  }

  console.log(`  📦 Creating collection "${name}"...`);

  await apiRequest('/collections', 'POST', {
    collection: name,
    meta: {
      icon: meta.icon || 'box',
      note: meta.note || null,
      singleton: meta.singleton || false,
      ...meta,
    },
    schema: {},
  });

  // Add fields
  for (const field of fields) {
    console.log(`     Adding field "${field.field}"...`);
    try {
      await apiRequest(`/fields/${name}`, 'POST', field);
    } catch (err) {
      console.log(`     ⚠️ Field "${field.field}" may already exist: ${err.message}`);
    }
  }

  console.log(`  ✅ Collection "${name}" created!`);
}

async function setPublicPermissions(collection) {
  console.log(`  🔓 Setting public read permissions for "${collection}"...`);

  try {
    await apiRequest('/permissions', 'POST', {
      role: null, // null = public
      collection: collection,
      action: 'read',
      fields: ['*'],
    });
  } catch (err) {
    console.log(`     ⚠️ Permission may already exist`);
  }
}

async function main() {
  console.log('\n🚀 ECJ Tires - Directus Setup\n');
  console.log(`📡 Connecting to: ${DIRECTUS_URL}\n`);

  try {
    // Test connection
    await apiRequest('/users/me');
    console.log('✅ Connected to Directus!\n');
  } catch (err) {
    console.error('❌ Failed to connect to Directus:', err.message);
    process.exit(1);
  }

  // ============================================
  // 1. SITE SETTINGS (Singleton)
  // ============================================
  console.log('\n📋 Creating Site Settings...');
  await createCollection('site_settings', [
    {
      field: 'site_name',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: { default_value: 'ECJ Tire Supply' },
    },
    {
      field: 'tagline',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 'Quality Tires & Expert Service' },
    },
    {
      field: 'logo',
      type: 'uuid',
      meta: { interface: 'file-image', width: 'half' },
      schema: {},
    },
    {
      field: 'phone',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'email',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'facebook_url',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'instagram_url',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'tiktok_url',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
  ], { singleton: true, icon: 'settings' });
  await setPublicPermissions('site_settings');

  // ============================================
  // 2. BRANCHES
  // ============================================
  console.log('\n📋 Creating Branches...');
  await createCollection('branches', [
    {
      field: 'name',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'is_main_branch',
      type: 'boolean',
      meta: { interface: 'boolean', width: 'half' },
      schema: { default_value: false },
    },
    {
      field: 'address',
      type: 'text',
      meta: { interface: 'input-multiline', width: 'full' },
      schema: {},
    },
    {
      field: 'phone',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'email',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'operating_hours',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'map_embed_url',
      type: 'text',
      meta: { interface: 'input-multiline', width: 'full' },
      schema: {},
    },
    {
      field: 'image',
      type: 'uuid',
      meta: { interface: 'file-image', width: 'half' },
      schema: {},
    },
    {
      field: 'sort_order',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 0 },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] },
      },
      schema: { default_value: 'published' },
    },
  ], { icon: 'location_on' });
  await setPublicPermissions('branches');

  // ============================================
  // 3. SERVICES
  // ============================================
  console.log('\n📋 Creating Services...');
  await createCollection('services', [
    {
      field: 'name',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'slug',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'short_description',
      type: 'text',
      meta: { interface: 'input-multiline', width: 'full' },
      schema: {},
    },
    {
      field: 'full_description',
      type: 'text',
      meta: { interface: 'input-rich-text-html', width: 'full' },
      schema: {},
    },
    {
      field: 'icon',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'image',
      type: 'uuid',
      meta: { interface: 'file-image', width: 'half' },
      schema: {},
    },
    {
      field: 'is_featured',
      type: 'boolean',
      meta: { interface: 'boolean', width: 'half' },
      schema: { default_value: false },
    },
    {
      field: 'sort_order',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 0 },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] },
      },
      schema: { default_value: 'published' },
    },
  ], { icon: 'build' });
  await setPublicPermissions('services');

  // ============================================
  // 4. TIRES
  // ============================================
  console.log('\n📋 Creating Tires...');
  await createCollection('tires', [
    {
      field: 'name',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'brand',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'size',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'rim_size',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'price',
      type: 'decimal',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'quantity',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 0 },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: { choices: [
          { text: 'In Stock', value: 'in_stock' },
          { text: 'Limited Stock', value: 'limited' },
          { text: 'Out of Stock', value: 'out_of_stock' },
        ]},
      },
      schema: { default_value: 'in_stock' },
    },
    {
      field: 'image',
      type: 'uuid',
      meta: { interface: 'file-image', width: 'half' },
      schema: {},
    },
    {
      field: 'is_featured',
      type: 'boolean',
      meta: { interface: 'boolean', width: 'half' },
      schema: { default_value: false },
    },
    {
      field: 'sort_order',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 0 },
    },
  ], { icon: 'tire_repair' });
  await setPublicPermissions('tires');

  // ============================================
  // 5. MAGS
  // ============================================
  console.log('\n📋 Creating Mags...');
  await createCollection('mags', [
    {
      field: 'name',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'brand',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'size',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'finish',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'price',
      type: 'decimal',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'image',
      type: 'uuid',
      meta: { interface: 'file-image', width: 'half' },
      schema: {},
    },
    {
      field: 'is_featured',
      type: 'boolean',
      meta: { interface: 'boolean', width: 'half' },
      schema: { default_value: false },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: { choices: [
          { text: 'In Stock', value: 'in_stock' },
          { text: 'Limited Stock', value: 'limited' },
          { text: 'Out of Stock', value: 'out_of_stock' },
        ]},
      },
      schema: { default_value: 'in_stock' },
    },
    {
      field: 'sort_order',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 0 },
    },
  ], { icon: 'donut_large' });
  await setPublicPermissions('mags');

  // ============================================
  // 6. TIRE BRANDS
  // ============================================
  console.log('\n📋 Creating Tire Brands...');
  await createCollection('tire_brands', [
    {
      field: 'name',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'logo',
      type: 'uuid',
      meta: { interface: 'file-image', width: 'half' },
      schema: {},
    },
    {
      field: 'is_featured',
      type: 'boolean',
      meta: { interface: 'boolean', width: 'half' },
      schema: { default_value: true },
    },
    {
      field: 'sort_order',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 0 },
    },
  ], { icon: 'verified' });
  await setPublicPermissions('tire_brands');

  // ============================================
  // 7. GALLERY
  // ============================================
  console.log('\n📋 Creating Gallery...');
  await createCollection('gallery', [
    {
      field: 'title',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'image',
      type: 'uuid',
      meta: { interface: 'file-image', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'category',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: { choices: [
          { text: 'Tires', value: 'tires' },
          { text: 'Wheels & Mags', value: 'wheels' },
          { text: 'Services', value: 'services' },
          { text: 'Our Shop', value: 'shop' },
          { text: 'Happy Customers', value: 'customers' },
        ]},
      },
      schema: {},
    },
    {
      field: 'is_featured',
      type: 'boolean',
      meta: { interface: 'boolean', width: 'half' },
      schema: { default_value: false },
    },
    {
      field: 'sort_order',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 0 },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] },
      },
      schema: { default_value: 'published' },
    },
  ], { icon: 'photo_library' });
  await setPublicPermissions('gallery');

  // ============================================
  // 8. TESTIMONIALS
  // ============================================
  console.log('\n📋 Creating Testimonials...');
  await createCollection('testimonials', [
    {
      field: 'customer_name',
      type: 'string',
      meta: { interface: 'input', required: true, width: 'half' },
      schema: {},
    },
    {
      field: 'location',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'rating',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
      schema: { default_value: 5 },
    },
    {
      field: 'content',
      type: 'text',
      meta: { interface: 'input-multiline', required: true, width: 'full' },
      schema: {},
    },
    {
      field: 'is_featured',
      type: 'boolean',
      meta: { interface: 'boolean', width: 'half' },
      schema: { default_value: true },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] },
      },
      schema: { default_value: 'published' },
    },
  ], { icon: 'format_quote' });
  await setPublicPermissions('testimonials');

  // ============================================
  // 9. CONTACT SUBMISSIONS
  // ============================================
  console.log('\n📋 Creating Contact Submissions...');
  await createCollection('contact_submissions', [
    {
      field: 'name',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'email',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'phone',
      type: 'string',
      meta: { interface: 'input', width: 'half' },
      schema: {},
    },
    {
      field: 'message',
      type: 'text',
      meta: { interface: 'input-multiline', width: 'full' },
      schema: {},
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: { choices: [
          { text: 'New', value: 'new' },
          { text: 'Read', value: 'read' },
          { text: 'Replied', value: 'replied' },
        ]},
      },
      schema: { default_value: 'new' },
    },
  ], { icon: 'mail' });
  // No public permissions for contact_submissions (admin only)

  console.log('\n\n✅ All collections created successfully!\n');
  console.log('📝 Next steps:');
  console.log('   1. Go to Directus Admin: ' + DIRECTUS_URL + '/admin');
  console.log('   2. Add your branch locations (ECJ Tires & ECJL Tires)');
  console.log('   3. Add your services');
  console.log('   4. Add tires and mags inventory');
  console.log('   5. Upload gallery photos\n');
}

main().catch(console.error);
