let store = {};

export async function setItemAsync(key, value) {
  store[key] = value;
}

export async function getItemAsync(key) {
  return store[key] || null;
}

export async function deleteItemAsync(key) {
  delete store[key];
}

export function clearStore() {
  store = {};
}