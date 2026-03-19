// Mock auth — no role distinction, any user can do everything

const MOCK_USERS = [
  {
    id: "1",
    email: "demo@sponsir.io",
    password_hash: "password123",
    name: "Demo User",
    created_at: "2024-01-01T00:00:00Z",
  },
  // Keep legacy accounts so existing demos don't break
  {
    id: "2",
    email: "sponsor@example.com",
    password_hash: "password123",
    name: "Sponsor Demo",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "organizer@example.com",
    password_hash: "password123",
    name: "Organizer Demo",
    created_at: "2024-01-01T00:00:00Z",
  },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const getCurrentUser = async () => {
  try {
    const json = localStorage.getItem("currentUser");
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
};

export const login = async (email, password) => {
  await delay(400);
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user || user.password_hash !== password) throw new Error("Invalid email or password");
  const { password_hash, ...safe } = user;
  localStorage.setItem("currentUser", JSON.stringify(safe));
  localStorage.setItem("authToken", `mock-token-${Date.now()}`);
  return safe;
};

export const register = async (email, password) => {
  await delay(400);
  if (MOCK_USERS.find((u) => u.email === email)) throw new Error("Email already in use");
  const newUser = {
    id: `${MOCK_USERS.length + 1}`,
    email,
    password_hash: password,
    name: email.split("@")[0],
    created_at: new Date().toISOString(),
  };
  MOCK_USERS.push(newUser);
  const { password_hash, ...safe } = newUser;
  localStorage.setItem("currentUser", JSON.stringify(safe));
  localStorage.setItem("authToken", `mock-token-${Date.now()}`);
  return safe;
};

export const logout = async () => {
  await delay(200);
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");
  return true;
};

export const updateProfile = async (userData) => {
  const current = await getCurrentUser();
  if (!current) throw new Error("Not authenticated");
  const updated = { ...current, ...userData, updated_at: new Date().toISOString() };
  localStorage.setItem("currentUser", JSON.stringify(updated));
  return updated;
};

export const verifyToken = async (token) => {
  return localStorage.getItem("authToken") === token;
};
