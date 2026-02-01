/**
 * ECJ Tires - Seed Initial Data
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
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function main() {
  console.log('\n🌱 Seeding ECJ Tires Data...\n');

  // ============================================
  // BRANCHES
  // ============================================
  console.log('📍 Adding branches...');

  await apiRequest('/items/branches', 'POST', {
    name: 'ECJ Tires',
    is_main_branch: true,
    address: 'Main Street, Antipolo City, Rizal, Philippines',
    phone: '+63 912 345 6789',
    email: 'ecjtires@email.com',
    operating_hours: '8:00 AM - 5:00 PM Daily',
    sort_order: 1,
    status: 'published',
  });
  console.log('   ✅ ECJ Tires (Main Branch) added');

  await apiRequest('/items/branches', 'POST', {
    name: 'ECJL Tires',
    is_main_branch: false,
    address: 'Second Branch Location, Antipolo City, Rizal, Philippines',
    phone: '+63 912 345 6790',
    email: 'ecjltires@email.com',
    operating_hours: '8:00 AM - 5:00 PM Daily',
    sort_order: 2,
    status: 'published',
  });
  console.log('   ✅ ECJL Tires added');

  // ============================================
  // SERVICES
  // ============================================
  console.log('\n🔧 Adding services...');

  const services = [
    { name: 'Tire Installation & Mounting', slug: 'tire-installation', icon: 'tire-installation', short_description: 'Professional tire mounting and installation for all vehicle types.', sort_order: 1 },
    { name: 'Wheel Alignment', slug: 'wheel-alignment', icon: 'wheel-alignment', short_description: 'Precision alignment to extend tire life and improve handling.', sort_order: 2 },
    { name: 'Tire Balancing', slug: 'tire-balancing', icon: 'tire-balancing', short_description: 'Computer-balanced wheels for a smooth, vibration-free ride.', sort_order: 3 },
    { name: 'Vulcanizing & Tire Repair', slug: 'vulcanizing', icon: 'vulcanizing', short_description: 'Expert tire repair and patching services.', sort_order: 4 },
    { name: 'Change Oil', slug: 'change-oil', icon: 'change-oil', short_description: 'Quality oil change service to keep your engine running smoothly.', sort_order: 5 },
    { name: 'Brake Service', slug: 'brake-service', icon: 'brake-service', short_description: 'Complete brake inspection, repair, and replacement.', sort_order: 6 },
    { name: 'Underchassis Repair', slug: 'underchassis', icon: 'underchassis', short_description: 'Suspension and underchassis maintenance and repair.', sort_order: 7 },
    { name: 'Battery Service', slug: 'battery', icon: 'battery', short_description: 'Battery testing, charging, and replacement services.', sort_order: 8 },
    { name: 'Aircon Cleaning', slug: 'aircon', icon: 'aircon', short_description: 'Car air conditioning cleaning and maintenance.', sort_order: 9 },
  ];

  for (const service of services) {
    await apiRequest('/items/services', 'POST', {
      ...service,
      is_featured: service.sort_order <= 6,
      status: 'published',
    });
    console.log(`   ✅ ${service.name} added`);
  }

  // ============================================
  // TESTIMONIALS
  // ============================================
  console.log('\n💬 Adding testimonials...');

  const testimonials = [
    { customer_name: 'Juan Dela Cruz', location: 'Antipolo', rating: 5, content: 'Excellent service! The team was professional and the prices are very reasonable. Highly recommended!' },
    { customer_name: 'Maria Santos', location: 'Marikina', rating: 5, content: 'Fast and reliable. I\'ve been coming here for years and they never disappoint.' },
    { customer_name: 'Pedro Reyes', location: 'Cainta', rating: 5, content: 'Best tire shop in the area. Great selection of tires and excellent customer service.' },
  ];

  for (const testimonial of testimonials) {
    await apiRequest('/items/testimonials', 'POST', {
      ...testimonial,
      is_featured: true,
      status: 'published',
    });
    console.log(`   ✅ Testimonial from ${testimonial.customer_name} added`);
  }

  // ============================================
  // SITE SETTINGS
  // ============================================
  console.log('\n⚙️ Setting up site settings...');

  await apiRequest('/items/site_settings', 'POST', {
    site_name: 'ECJ Tire Supply',
    tagline: 'Quality Tires & Expert Service',
    phone: '+63 912 345 6789',
    email: 'info@ecjtires.com',
  });
  console.log('   ✅ Site settings configured');

  console.log('\n\n✅ Seed data added successfully!\n');
  console.log('🌐 Your website should now show real data from Directus.');
  console.log('📝 Go to Directus to add more content: ' + DIRECTUS_URL + '/admin\n');
}

main().catch(console.error);
