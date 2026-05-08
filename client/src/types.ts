export interface Reminder {
  id: string
  name: string
  date: string
  icon?: string
  createdAt: number
  tags: string[]
}

export interface Tag {
  id: string
  name: string
  birthdayId: string
  createdAt: number
}
