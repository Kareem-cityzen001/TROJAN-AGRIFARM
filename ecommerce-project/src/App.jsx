import {Routes, Route } from 'react-router';
import {HomePage} from './pages/HomePage';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path index element={<HomePage />}> </Route>
      <Route path ="checkout" element={<div>test checkout page</div>}> </Route>
    </Routes>
  )
}

export default App
