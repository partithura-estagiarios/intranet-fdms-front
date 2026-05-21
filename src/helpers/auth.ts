export function getAuthTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem("users");
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    const tokenCandidate =
      parsed?.stateUser?.auth?.token ??
      parsed?.auth?.token ??
      parsed?.stateUser?.stateUser?.auth?.token;

    if (typeof tokenCandidate !== "string") {
      return null;
    }
    const token = tokenCandidate.trim();
    return token ? token : null;
  } catch {
    return null;
  }
}

export function buildAuthorizationHeader(): Record<string, string> {
  const token = getAuthTokenFromStorage();
  if (!token) {
    return {};
  }

  if (token.toLowerCase().startsWith("bearer ")) {
    return { Authorization: token };
  }

  return { Authorization: `Bearer ${token}` };
}
