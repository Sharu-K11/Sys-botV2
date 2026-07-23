export type Standing = 'None' | 'Freshman' | 'Sophomore' | 'Junior' | 'Senior'

export interface RegisterRequest {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  school?: string
  standing: Standing
}

export type UserRegistration = RegisterRequest

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface Chat {
  id: number
  title: string
}

export interface Message {
  id: number
  chat_id?: number
  char_id?: number
  user_id: number
  content: string
  role?: 'user' | 'assistant'
  created_at?: string
}

export interface Agent {
  id: string
  name: string
  nickname: string
  personality: string
  traits: string[]
  technique: string
  description: string
  recommendedUse: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

