import '@testing-library/jest-dom'

// Mock fetch for testing
global.fetch = vi.fn()

// Mock import.meta.env
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      BASE_URL: '/Symphony-Layer-Explorer/'
    }
  }
})