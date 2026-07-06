export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

function mapFirestoreError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Firestore kurulumu")) return message;
  if (message.includes("permission-denied") || message.includes("Missing or insufficient permissions")) {
    return "Firestore izin hatası. Firebase Console'da Firestore Rules'u kontrol et.";
  }
  if (message.includes("unavailable") || message.includes("Could not reach")) {
    return "Firestore'a bağlanılamadı. İnternet bağlantını ve Firestore kurulumunu kontrol et.";
  }
  if (message.includes("timed out") || message.includes("zaman aşımı")) {
    return "Firestore yanıt vermedi. Firebase Console'da Firestore Database oluşturulmuş mu kontrol et.";
  }

  return `Kayıt hatası: ${message}`;
}

export async function runFirestore<T>(
  operation: () => Promise<T>,
  timeoutMs = 15000
): Promise<T> {
  try {
    return await withTimeout(
      operation(),
      timeoutMs,
      "Firestore zaman aşımı — Firebase Console'da Firestore Database oluştur."
    );
  } catch (error) {
    throw new Error(mapFirestoreError(error));
  }
}
