import type {
  AuthResponse,
  Chat,
  LoginRequest,
  Message,
  RegisterRequest,
} from '../types'

const API_BASE_URL = 'http://localhost:8000/api'

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
  const token = localStorage.getItem('access_token')

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
  const auth = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  localStorage.setItem('access_token', auth.access_token)
  return auth
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

export function createMessage(chatId: number, content: string): Promise<void> {
  return request(`/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
