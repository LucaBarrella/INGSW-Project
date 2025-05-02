// __mocks__/@react-native-async-storage/async-storage.js

// Simple in-memory storage mock for Jest
let store = {};

export default {
  setItem: jest.fn((key, value) => {
    return new Promise((resolve) => {
      store[key] = value;
      resolve(null);
    });
  }),
  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      resolve(store[key] || null);
    });
  }),
  removeItem: jest.fn((key) => {
    return new Promise((resolve) => {
      delete store[key];
      resolve(null);
    });
  }),
  clear: jest.fn(() => {
    return new Promise((resolve) => {
      store = {};
      resolve(null);
    });
  }),
  getAllKeys: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(Object.keys(store));
    });
  }),
  multiGet: jest.fn((keys) => {
    return new Promise((resolve) => {
      const result = keys.map(key => [key, store[key] || null]);
      resolve(result);
    });
  }),
  multiSet: jest.fn((keyValuePairs) => {
    return new Promise((resolve) => {
      keyValuePairs.forEach(([key, value]) => {
        store[key] = value;
      });
      resolve(null);
    });
  }),
  multiRemove: jest.fn((keys) => {
    return new Promise((resolve) => {
      keys.forEach(key => {
        delete store[key];
      });
      resolve(null);
    });
  }),
  // Add any other methods you might use from AsyncStorage
};

// Helper to reset the store between tests
export const __INTERNAL_MOCK_STORAGE__ = {
  _clear: () => { store = {}; },
  _getStore: () => store,
};