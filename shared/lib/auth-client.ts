const AUTH_BASE_PATH = "/api/auth";

type AuthResponse<T = unknown> = {
  data?: T | null;
  error?: {
    message?: string;
    code?: string;
    status?: number;
  } | null;
};

async function authFetch<T>(path: string, init?: RequestInit): Promise<AuthResponse<T>> {
  const response = await fetch(`${AUTH_BASE_PATH}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => null)) as AuthResponse<T> | null;

  if (!response.ok) {
    return {
      data: null,
      error: body?.error ?? {
        message: `Request failed with status ${response.status}`,
        status: response.status,
      },
    };
  }

  return {
    data: body?.data ?? null,
    error: body?.error ?? null,
  };
}

export function signUpWithEmail(payload: { email: string; password: string; name: string }) {
  return authFetch("/sign-up/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signInWithEmail(payload: { email: string; password: string }) {
  return authFetch("/sign-in/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signOut() {
  return authFetch("/sign-out", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function getSession() {
  return authFetch("/get-session", {
    method: "GET",
  });
}

export function forgotPassword(payload: { email: string; redirectTo: string }) {
  return authFetch("/request-password-reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload: { token: string; newPassword: string }) {
  return authFetch("/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
