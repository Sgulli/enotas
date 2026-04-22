export class AuthError extends Error {
  constructor(message = "Session expired") {
    super(message);
    this.name = "AuthError";
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError || (error instanceof Error && error.name === "AuthError");
}
