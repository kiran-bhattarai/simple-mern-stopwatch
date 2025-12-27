import Stopwatch from './Stopwatch'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import { Route, Routes } from "react-router-dom"

function App() {


  return (
    <Routes>
      <Route path='/' element={<Stopwatch />}></Route>
      <Route path='/signup' element={<SignupPage />}></Route>
      <Route path='/login' element={<LoginPage />}></Route>
    </Routes>
  )

}

export default App
