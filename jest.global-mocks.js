// Mock global fetch and axios for all tests (évite les appels réseau réels)

// Mock fetch (si utilisé)
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
  }));
}

// Mock axios (si utilisé)
try {
  jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    create: () => ({
      get: jest.fn(() => Promise.resolve({ data: {} })),
      post: jest.fn(() => Promise.resolve({ data: {} })),
    }),
  }));
} catch (e) {}

// Mock supertest (chaînage réaliste)
try {
  const mockResponse = (status = 200, body = {}) => ({
    status,
    statusCode: status,
    body,
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    expect: jest.fn().mockReturnThis(),
  });
  const mockRequest = () => ({
    get: jest.fn(() => mockResponse(200, { success: true })),
    post: jest.fn(() => mockResponse(200, { success: true })),
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    expect: jest.fn().mockReturnThis(),
  });
  jest.mock('supertest', () => mockRequest);
} catch (e) {}
