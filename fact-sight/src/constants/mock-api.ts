////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: number): Product {
      const categories = [
        'Electronics',
        'Furniture',
        'Clothing',
        'Toys',
        'Groceries',
        'Books',
        'Jewelry',
        'Beauty Products'
      ];

      return {
        id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();

// Define the shape of Job data
export type Job = {
  photo_url: string;
  title: string;
  description: string;
  created_at: string;
  salary: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock job data store
export const fakeJobs = {
  records: [] as Job[], // Holds the list of job objects

  // Initialize with sample data
  initialize() {
    const sampleJobs: Job[] = [];
    function generateRandomJobData(id: number): Job {
      const categories = [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Marketing',
        'Sales'
      ];

      return {
        id,
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraph(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        salary: parseFloat(faker.commerce.price({ min: 30000, max: 150000, dec: 2 })),
        photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleJobs.push(generateRandomJobData(i));
    }

    this.records = sampleJobs;
  },

  // Get all jobs with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let jobs = [...this.records];

    // Filter jobs based on selected categories
    if (categories.length > 0) {
      jobs = jobs.filter((job) =>
        categories.includes(job.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      jobs = matchSorter(jobs, search, {
        keys: ['title', 'description', 'category']
      });
    }

    return jobs;
  },

  // Get paginated results with optional category filtering and search
  async getJobs({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allJobs = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalJobs = allJobs.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedJobs = allJobs.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_jobs: totalJobs,
      offset,
      limit,
      jobs: paginatedJobs
    };
  },

  // Get a specific job by its ID
  async getJobById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the job by its ID
    const job = this.records.find((job) => job.id === id);

    if (!job) {
      return {
        success: false,
        message: `Job with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Job with ID ${id} found`,
      job
    };
  }
};

// Initialize sample jobs
fakeJobs.initialize();

// Define the shape of Profile data
export type Profile = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  email: string;
  id: number;
  category: string;
  updated_at: string;
};

// Mock profile data store
export const fakeProfiles = {
  records: [] as Profile[], // Holds the list of profile objects

  // Initialize with sample data
  initialize() {
    const sampleProfiles: Profile[] = [];
    function generateRandomProfileData(id: number): Profile {
      const categories = [
        'Developer',
        'Designer',
        'Manager',
        'Analyst',
        'Consultant',
        'Engineer'
      ];

      return {
        id,
        name: faker.person.fullName(),
        description: faker.person.bio(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        email: faker.internet.email(),
        photo_url: `https://api.slingacademy.com/public/sample-users/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProfiles.push(generateRandomProfileData(i));
    }

    this.records = sampleProfiles;
  },

  // Get all profiles with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let profiles = [...this.records];

    // Filter profiles based on selected categories
    if (categories.length > 0) {
      profiles = profiles.filter((profile) =>
        categories.includes(profile.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      profiles = matchSorter(profiles, search, {
        keys: ['name', 'description', 'category', 'email']
      });
    }

    return profiles;
  },

  // Get paginated results with optional category filtering and search
  async getProfiles({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProfiles = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProfiles = allProfiles.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProfiles = allProfiles.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_profiles: totalProfiles,
      offset,
      limit,
      profiles: paginatedProfiles
    };
  },

  // Get a specific profile by its ID
  async getProfileById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the profile by its ID
    const profile = this.records.find((profile) => profile.id === id);

    if (!profile) {
      return {
        success: false,
        message: `Profile with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Profile with ID ${id} found`,
      profile
    };
  }
};

// Initialize sample profiles
fakeProfiles.initialize();
