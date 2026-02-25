type SessionType = "backend" | "local" | "none"

// Resuelve el tipo de sesión en cliente (rápido) o servidor (cookies).
async function resolveSessionType(): Promise<SessionType> {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("localToken") ? "local" : "backend"
  }

  const { getSessionType } = await import("./session")
  return getSessionType()
}

// Protege llamadas locales cuando el código se ejecuta en servidor.
function assertClientForLocalSession(sessionType: SessionType) {
  if (sessionType === "local" && typeof window === "undefined") {
    throw new Error("LOCAL_SESSION_REQUIRES_CLIENT")
  }
}

// Obtiene cuentas según origen de sesión activo.
export async function getAccounts() {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { getAccounts } = await import("@/src/actions/get-accounts-action")
    return getAccounts()
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { getAccounts } = await import("@/src/indexdb/accounts")
    return getAccounts()
  }

  throw new Error("SESSION_NONE")
}

// Crea cuenta en backend o local según la sesión activa.
export async function createAccountAction(prevState: unknown, formData: FormData) {
  const sessionType = await resolveSessionType()

  if (sessionType === "backend") {
    const { createAccountAction } = await import("@/src/actions/create-account-action")
    return createAccountAction(prevState, formData)
  }

  assertClientForLocalSession(sessionType)

  if (sessionType === "local") {
    const { createAccountAction } = await import("@/src/indexdb/users")
    return createAccountAction(prevState, formData)
  }

  throw new Error("SESSION_NONE")
}
