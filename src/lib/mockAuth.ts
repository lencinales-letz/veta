export type MockUser = {
  id: string;
  fullName: string;
  email: string;
};

type LoginParams = {
  email: string;
  password: string;
};

type ForgotPasswordParams = {
  email: string;
};

const MOCK_USERS: MockUser[] = [
  { id: "u_001", fullName: "Ada Lovelace", email: "ada@example.com" },
  { id: "u_002", fullName: "Alan Turing", email: "alan@example.com" },
  { id: "u_003", fullName: "Grace Hopper", email: "grace@example.com" },
];

function simulateLatency<T>(value: T, min = 700, max = 1200): Promise<T> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}

function simulateError<T>(error: Error, probability = 0.08): Promise<T> {
  return new Promise((_, reject) => {
    const roll = Math.random();
    setTimeout(() => {
      if (roll < probability) reject(error);
    }, 250);
  });
}

export async function mockLogin({ email, password }: LoginParams): Promise<MockUser> {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Correo inválido");
  }
  if (!password || password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  await Promise.race([
    simulateError(new Error("Servicio temporalmente no disponible"), 0.05),
    simulateLatency(null),
  ]);

  if (!found) {
    throw new Error("Credenciales inválidas");
  }

  return simulateLatency(found);
}

export async function mockForgotPassword({ email }: ForgotPasswordParams): Promise<{ success: boolean }>{
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Correo inválido");
  }
  const exists = MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase());
  await Promise.race([
    simulateError(new Error("No se pudo enviar el correo"), 0.05),
    simulateLatency(null),
  ]);

  if (!exists) {
    // Para el prototipo, respondemos como si todo fuera OK (no revelamos existencia)
    return { success: true };
  }
  return simulateLatency({ success: true });
}


