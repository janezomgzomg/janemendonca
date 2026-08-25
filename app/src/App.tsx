import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import { pages } from './pages/registry'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header items={pages.map(({ path, label }) => ({ path, label }))} />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <Routes>
            {pages.map((page) => {
              const Component = page.component
              return (
                <Route
                  key={page.path}
                  path={page.path}
                  element={<Component data={page.data} />}
                />
              )
            })}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
