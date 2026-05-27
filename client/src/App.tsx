import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { RemindersProvider } from '@/contexts/RemindersProvider'
import { ToastProvider } from '@/components/ui'
import Layout from '@/components/Layout'
import FrontPage from '@/pages/FrontPage'
import TagsPage from '@/pages/TagsPage'
import SettingsPage from '@/pages/SettingsPage'
import DonatePage from '@/pages/DonatePage'

export default function App() {
  return (
    <ThemeProvider>
      <RemindersProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<FrontPage />} />
                <Route path="/tags" element={<TagsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/donate" element={<DonatePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </RemindersProvider>
    </ThemeProvider>
  )
}
