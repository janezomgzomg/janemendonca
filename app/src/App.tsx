import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav/Nav'
import { pages } from './pages/registry'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Nav items={pages.map(({ path, label }) => ({ path, label }))} />
        <main className="p-4">
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
