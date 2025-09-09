// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Set timezone for consistent test results
process.env.TZ = 'America/Toronto';

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SOURCE_MODE = process.env.NEXT_PUBLIC_SOURCE_MODE ?? 'mirror';
process.env.SOURCE_MODE = process.env.SOURCE_MODE ?? 'mirror';
process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = 'test';
process.env.NEXT_PUBLIC_ALGOLIA_INDEX = 'test_index';
process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME = 'test_index';
process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY = 'search_test_key';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_role';
process.env.EDAMAM_APP_ID = 'test_edamam';
process.env.EDAMAM_APP_KEY = 'test_edamam_key';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));