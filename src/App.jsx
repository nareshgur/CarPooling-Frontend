import { useState } from 'react'
import { Provider } from 'react-redux'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { store } from './store/slices/store'
// import { Router } from 'express'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Publish from './pages/Publish'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Provider store={store}>
        <AppRoutes/>
    </Provider>
    </>
  )
}

export default App
