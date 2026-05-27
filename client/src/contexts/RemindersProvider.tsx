import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { DEMO_MODE_KEY, RemindersContext } from '@/contexts/RemindersContext'
import { queryKeys } from '@/queryKeys'
import type { Reminder, Tag } from '@/types'
import { getDemoReminders } from '@/utils/demoData'

type ReminderInput = Omit<Reminder, 'id' | 'createdAt'>
type ApiReminderInput = Omit<Reminder, 'id' | 'createdAt' | 'tags'> & { tags?: string[] }

export function RemindersProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isDemoMode, setIsDemoModeState] = useState(
    () => localStorage.getItem(DEMO_MODE_KEY) === 'true'
  )
  const queryKey = queryKeys.reminders(isDemoMode)

  const { data: reminders = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => isDemoMode ? getDemoReminders() : api.getReminders(),
  })

  const setReminders = useCallback((updater: (current: Reminder[]) => Reminder[]) => {
    queryClient.setQueryData<Reminder[]>(queryKey, current => updater(current ?? []))
  }, [queryClient, queryKey])

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey })
  }, [queryClient, queryKey])

  const setDemoMode = useCallback((enabled: boolean) => {
    localStorage.setItem(DEMO_MODE_KEY, String(enabled))
    setIsDemoModeState(enabled)
  }, [])

  const createMutation = useMutation({
    mutationFn: (reminder: ApiReminderInput) => api.createReminder(reminder),
    onSuccess: reminder => {
      setReminders(current => [reminder, ...current])
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, reminder }: { id: string; reminder: ApiReminderInput }) =>
      api.updateReminder(id, reminder),
    onSuccess: reminder => {
      setReminders(current => current.map(item => item.id === reminder.id ? reminder : item))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteReminder,
    onSuccess: (_, id) => {
      setReminders(current => current.filter(item => item.id !== id))
    },
  })

  const addReminder = useCallback(async (reminder: ReminderInput) => {
    if (isDemoMode) {
      const created: Reminder = { ...reminder, id: `demo-${Date.now()}`, createdAt: Date.now() }
      setReminders(current => [created, ...current])
      return
    }
    await createMutation.mutateAsync(reminder)
  }, [createMutation, isDemoMode, setReminders])

  const updateReminder = useCallback(async (id: string, reminder: ReminderInput) => {
    if (isDemoMode) {
      setReminders(current => current.map(item => item.id === id ? { ...item, ...reminder } : item))
      return
    }
    await updateMutation.mutateAsync({ id, reminder })
  }, [isDemoMode, setReminders, updateMutation])

  const deleteReminder = useCallback(async (id: string) => {
    if (isDemoMode) {
      setReminders(current => current.filter(item => item.id !== id))
      return
    }
    await deleteMutation.mutateAsync(id)
  }, [deleteMutation, isDemoMode, setReminders])

  const addTagMutation = useMutation({
    mutationFn: ({ reminderId, tag }: { reminderId: string; tag: string }) =>
      api.addTag(reminderId, tag),
    onSuccess: (_, { reminderId, tag }) => {
      setReminders(current => current.map(item =>
        item.id === reminderId ? { ...item, tags: [...(item.tags ?? []), tag] } : item
      ))
    },
  })

  const updateTagsMutation = useMutation({
    mutationFn: ({ reminderId, tags }: { reminderId: string; tags: string[] }) =>
      api.updateTags(reminderId, tags),
    onSuccess: (_, { reminderId, tags }) => {
      setReminders(current => current.map(item =>
        item.id === reminderId ? { ...item, tags } : item
      ))
    },
  })

  const deleteTagMutation = useMutation({
    mutationFn: ({ reminderId, tagId }: { reminderId: string; tagId: string }) =>
      api.deleteTag(reminderId, tagId),
    onSuccess: (_, { reminderId, tagId }) => {
      setReminders(current => current.map(item =>
        item.id === reminderId
          ? { ...item, tags: item.tags?.filter(tag => tag !== tagId) ?? [] }
          : item
      ))
    },
  })

  const addTag = useCallback(async (reminderId: string, tag: string) => {
    if (isDemoMode) {
      setReminders(current => current.map(item =>
        item.id === reminderId ? { ...item, tags: [...(item.tags ?? []), tag] } : item
      ))
      return
    }
    await addTagMutation.mutateAsync({ reminderId, tag })
  }, [addTagMutation, isDemoMode, setReminders])

  const updateTags = useCallback(async (reminderId: string, tags: string[]) => {
    if (isDemoMode) {
      setReminders(current => current.map(item => item.id === reminderId ? { ...item, tags } : item))
      return
    }
    await updateTagsMutation.mutateAsync({ reminderId, tags })
  }, [isDemoMode, setReminders, updateTagsMutation])

  const deleteTag = useCallback(async (reminderId: string, tagId: string) => {
    if (isDemoMode) {
      setReminders(current => current.map(item =>
        item.id === reminderId
          ? { ...item, tags: item.tags?.filter(tag => tag !== tagId) ?? [] }
          : item
      ))
      return
    }
    await deleteTagMutation.mutateAsync({ reminderId, tagId })
  }, [deleteTagMutation, isDemoMode, setReminders])

  const getTags = useCallback((reminderId: string) => {
    return reminders.find(reminder => reminder.id === reminderId)?.tags ?? []
  }, [reminders])

  const tags = useMemo<Tag[]>(() => [], [])

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        tags,
        loading: isLoading,
        isDemoMode,
        setDemoMode,
        addReminder,
        updateReminder,
        deleteReminder,
        addTag,
        updateTags,
        deleteTag,
        getTags,
        refresh,
      }}
    >
      {children}
    </RemindersContext.Provider>
  )
}
