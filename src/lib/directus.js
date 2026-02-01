import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';

const directusUrl = import.meta.env.PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

const client = createDirectus(directusUrl).with(rest());

// Site Settings
export async function getSiteSettings() {
  try {
    const settings = await client.request(readSingleton('site_settings'));
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

// Branches
export async function getBranches() {
  try {
    const branches = await client.request(
      readItems('branches', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort_order'],
      })
    );
    return branches;
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
}

// Services
export async function getServices() {
  try {
    const services = await client.request(
      readItems('services', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort_order'],
      })
    );
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getFeaturedServices() {
  try {
    const services = await client.request(
      readItems('services', {
        filter: {
          status: { _eq: 'published' },
          is_featured: { _eq: true },
        },
        sort: ['sort_order'],
        limit: 6,
      })
    );
    return services;
  } catch (error) {
    console.error('Error fetching featured services:', error);
    return [];
  }
}

// Tires
export async function getTires(filters = {}) {
  try {
    const filterObj = { status: { _neq: 'draft' } };

    if (filters.brand) {
      filterObj.brand = { _eq: filters.brand };
    }
    if (filters.rim_size) {
      filterObj.rim_size = { _eq: filters.rim_size };
    }

    const tires = await client.request(
      readItems('tires', {
        filter: filterObj,
        sort: ['sort_order'],
      })
    );
    return tires;
  } catch (error) {
    console.error('Error fetching tires:', error);
    return [];
  }
}

export async function getFeaturedTires() {
  try {
    const tires = await client.request(
      readItems('tires', {
        filter: {
          status: { _neq: 'draft' },
          is_featured: { _eq: true },
        },
        sort: ['sort_order'],
        limit: 8,
      })
    );
    return tires;
  } catch (error) {
    console.error('Error fetching featured tires:', error);
    return [];
  }
}

// Mags/Wheels
export async function getMags(filters = {}) {
  try {
    const filterObj = { status: { _neq: 'draft' } };

    if (filters.brand) {
      filterObj.brand = { _eq: filters.brand };
    }
    if (filters.size) {
      filterObj.size = { _eq: filters.size };
    }

    const mags = await client.request(
      readItems('mags', {
        filter: filterObj,
        sort: ['sort_order'],
      })
    );
    return mags;
  } catch (error) {
    console.error('Error fetching mags:', error);
    return [];
  }
}

// Tire Brands
export async function getTireBrands() {
  try {
    const brands = await client.request(
      readItems('tire_brands', {
        filter: { is_featured: { _eq: true } },
        sort: ['sort_order'],
      })
    );
    return brands;
  } catch (error) {
    console.error('Error fetching tire brands:', error);
    return [];
  }
}

// Gallery
export async function getGalleryItems(category = null) {
  try {
    const filterObj = { status: { _eq: 'published' } };

    if (category) {
      filterObj.category = { _eq: category };
    }

    const items = await client.request(
      readItems('gallery', {
        filter: filterObj,
        sort: ['sort_order'],
      })
    );
    return items;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

// Testimonials
export async function getTestimonials() {
  try {
    const testimonials = await client.request(
      readItems('testimonials', {
        filter: {
          status: { _eq: 'published' },
          is_featured: { _eq: true },
        },
        sort: ['-date_created'],
        limit: 6,
      })
    );
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// Utility functions
export function getImageUrl(imageId) {
  if (!imageId) return '/placeholder.jpg';
  return `${directusUrl}/assets/${imageId}`;
}

export function formatPrice(price) {
  if (!price) return 'Contact for price';
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getStockStatus(status) {
  const statuses = {
    in_stock: { label: 'In Stock', class: 'badge-success' },
    limited: { label: 'Limited Stock', class: 'badge-warning' },
    out_of_stock: { label: 'Out of Stock', class: 'badge-danger' },
  };
  return statuses[status] || statuses.in_stock;
}

export { client };
