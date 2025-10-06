import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock environment variables
process.env.ADMIN_PASSWORD = 'test-password';
process.env.CALENDLY_WEBHOOK_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

// Mock fetch
global.fetch = jest.fn();

// Mock EventSource
global.EventSource = jest.fn().mockImplementation(() => ({
  close: jest.fn(),
  onopen: null,
  onmessage: null,
  onerror: null,
}));

// Mock crypto for webhook verification
Object.defineProperty(global, 'crypto', {
  value: {
    createHmac: jest.fn().mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('mock-signature'),
    }),
    timingSafeEqual: jest.fn().mockReturnValue(true),
  },
});

// Mock fs for file operations
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  appendFile: jest.fn(),
  mkdir: jest.fn(),
  access: jest.fn(),
}));

// Mock path
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  dirname: jest.fn(),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

// Mock cookie
jest.mock('cookie', () => ({
  serialize: jest.fn().mockReturnValue('mock-cookie'),
}));
