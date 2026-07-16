import type { Agent, ChatModel, UserRegistration } from '../types'

const API_BASE_URL = 'http://localhost:8000/api'

interface LoginPayload {
  identifier: string
  password: string
}

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

export async function registerUser(payload: UserRegistration): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }
}

export async function loginUser(_payload: LoginPayload): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 600)
  })
}

export async function sendChatMessage(
  agent: Agent,
  message: string,
  model: ChatModel,
): Promise<string> {
  await new Promise((resolve) => {
    setTimeout(resolve, 700)
  })

  return `I am ${agent.name} running on ${model}. I received your message: "${message}". This is a placeholder response until the FastAPI chat endpoint is connected.`
}
