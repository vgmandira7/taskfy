/**
 * Cliente HTTP baseado em fetch nativo.
 * Centraliza URL base, JSON, status HTTP e tratamento de erros da API Taskfy.
 */

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/** Erro lançado quando a API responde com status fora de 2xx ou fica inacessível. */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** A API devolve erros no formato { erro: string, detalhe?: string }. */
interface ApiErrorBody {
  erro?: string
  detalhe?: string
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_URL}/api${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    // fetch só rejeita em falhas de rede (API desligada, CORS, sem internet)
    throw new ApiError(
      'Não foi possível conectar à API. Verifique se o backend está em execução.',
      0,
    )
  }

  if (!response.ok) {
    let message = `Erro ${response.status} ao comunicar com a API.`
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.erro) message = body.erro
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new ApiError(message, response.status)
  }

  // 204 No Content (DELETE): não há corpo para ler
  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T, B>(path: string, body: B) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T, B>(path: string, body: B) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T, B>(path: string, body: B) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}

/** Extrai uma mensagem amigável de qualquer erro capturado em um catch. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Ocorreu um erro inesperado.'
}
