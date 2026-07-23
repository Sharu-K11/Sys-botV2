import type {
  AuthResponse,
  Chat,
  LoginRequest,
  Message,
  RegisterRequest,
} from '../types'

const API_BASE_URL = 'http://localhost:8000/api'
const ACCESS_TOKEN_KEY = 'access_token'

interface ApiErrorPayload {
  detail?: string
  message?: string
}

async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorPayload
    return data.detail || data.message || `Request failed with status ${response.status}`
  } catch {
    return `Request failed with status ${response.status}`
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401 && getAccessToken()) {
      logoutUser()
      window.location.assign('/login')
    }
    throw new Error(await parseApiError(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function registerUser(payload: RegisterRequest): Promise<void> {
  return request('/users/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const formData = new URLSearchParams()
  formData.set('username', payload.username.trim())
  formData.set('password', payload.password)

  const response = await fetch(`${API_BASE_URL}/auth/token/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }

  const auth = (await response.json()) as AuthResponse
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.access_token)
  return auth
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function logoutUser(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getChats(): Promise<Chat[]> {
  return request('/chats/')
}

export function createChat(firstMessage: string): Promise<Chat> {
  return request('/chats/create-chat', {
    method: 'POST',
    body: JSON.stringify({ first_message: firstMessage }),
  })
}

export function updateChat(chatId: number, title: string): Promise<Chat> {
  return request(`/chats/${chatId}`, {
    method: 'PUT',
    body: JSON.stringify({ title }),
  })
}

export function deleteChat(chatId: number): Promise<void> {
  return request(`/chats/${chatId}`, { method: 'DELETE' })
}

export function getMessages(chatId: number): Promise<Message[]> {
  return request(`/chats/${chatId}/messages`)
}

export function createMessage(chatId: number, content: string): Promise<Message> {
  return request(`/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
