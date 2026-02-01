/**
 * Add hero_background field to site_settings collection
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

async function main() {
  console.log('\n🚀 Adding hero_background field to site_settings\n');
  console.log(`📡 Connecting to: ${DIRECTUS_URL}\n`);

  if (!ADMIN_TOKEN) {
    console.error('❌ DIRECTUS_ADMIN_TOKEN environment variable is required');
    process.exit(1);
  }

  try {
    // Test connection
    await apiRequest('/users/me');
    console.log('✅ Connected to Directus!\n');
  } catch (err) {
    console.error('❌ Failed to connect to Directus:', err.message);
    process.exit(1);
  }

  // Add hero_background field to site_settings
  console.log('📦 Adding hero_background field...');
  try {
    await apiRequest('/fields/site_settings', 'POST', {
      field: 'hero_background',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        width: 'full',
        note: 'Background image for the homepage hero section (recommended: 1920x1080 or larger)',
        options: {
          crop: false,
        },
      },
      schema: {},
    });
    console.log('✅ hero_background field created!');
  } catch (err) {
    if (err.message.includes('already exists') || err.message.includes('Field')) {
      console.log('⏭️  Field may already exist, checking...');
    } else {
      console.error('❌ Error:', err.message);
    }
  }

  console.log('\n✅ Done!\n');
  console.log('📝 Next steps:');
  console.log('   1. Go to Directus Admin: ' + DIRECTUS_URL + '/admin');
  console.log('   2. Navigate to Site Settings');
  console.log('   3. Upload a hero background image');
  console.log('   4. The homepage will display the image\n');
}

main().catch(console.error);
