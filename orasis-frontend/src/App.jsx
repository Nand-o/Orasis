import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ExamplePage from './pages/ExamplePage'

function App() {
  const [count, setCount] = useState(0)
  const [showExample, setShowExample] = useState(false)

  if (showExample) {
    return <ExamplePage />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="h-24 w-24 hover:drop-shadow-[0_0_2em_#646cffaa] transition-all" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="h-24 w-24 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow transition-all" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-8">
          Vite + React + Tailwind CSS
        </h1>
        
        <div className="bg-gray-700 rounded-lg p-8 mb-8 max-w-md mx-auto">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl mb-4"
          >
            count is {count}
          </button>
          <p className="text-gray-300 mt-4 mb-6">
            Edit <code className="bg-gray-800 px-2 py-1 rounded text-blue-400">src/App.jsx</code> and save to test HMR
          </p>
          <button
            onClick={() => setShowExample(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl w-full"
          >
            Lihat Contoh Komponen
          </button>
        </div>
        
        <p className="text-gray-400">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
