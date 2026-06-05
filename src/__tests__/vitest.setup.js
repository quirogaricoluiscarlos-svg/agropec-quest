// Ensure localStorage is available in test environment
if (typeof globalThis.localStorage === 'undefined') {
  const storage = {};
  globalThis.localStorage = {
    getItem: (key) => storage[key] ?? null,
    setItem: (key, value) => { storage[key] = value; },
    removeItem: (key) => { delete storage[key]; },
    clear: () => { for (const key in storage) delete storage[key]; }
  };
}
