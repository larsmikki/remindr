import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { RemindersProvider } from '@/contexts/RemindersContext'
import Layout from '@/components/Layout'
import FrontPage from '@/pages/FrontPage'
import TagsPage from '@/pages/TagsPage'
import SettingsPage from '@/pages/SettingsPage'
import DonatePage from '@/pages/DonatePage'

export default function App() {
  return (
    <ThemeProvider>
      <RemindersProvider>
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
      </RemindersProvider>
    </ThemeProvider>
  )
}
