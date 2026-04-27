const API_BASE = import.meta.env.VITE_API_BASE;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function getLibrary() {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library`);
}

export async function updateLibrary(data) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function addUser(name) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/users`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function removeUser(name) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/users/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
}

export async function addBook(book) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/books`, {
    method: "POST",
    body: JSON.stringify(book),
  });
}

export async function updateBook(book) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/books/${encodeURIComponent(book.id)}`, {
    method: "PATCH",
    body: JSON.stringify(book),
  });
}

export async function removeBook(id) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/books/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getCollections() {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/collections`);
}

export async function addCollection(name, user) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/collections`, {
    method: "POST",
    body: JSON.stringify({ name, user }),
  });
}

export async function removeCollection(id) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/collections/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function updateCollection(id, name) {
  if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  return request(`${API_BASE}/library/collections/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

