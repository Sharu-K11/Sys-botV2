export type Standing = 'None' | 'Freshman' | 'Sophomore' | 'Junior' | 'Senior'

export interface UserRegistration {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  school?: string
  standing: Standing
}

export interface Agent {
  id: string
  name: string
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

export type ChatModel =
  | 'GPT-4.1'
  | 'GPT-4o'
  | 'Claude 3.7 Sonnet'
  | 'Gemini 2.5 Pro'
