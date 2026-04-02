import { GlowBackground } from './components/common/GlowBackground'
import { Navbar } from './components/navigation/Navbar'

function App() {

  return (
    <>
      <GlowBackground/>
      <Navbar/>
        <p className='text-2xl font-bold'>Hello from App.jsx!</p>
    </>
  )
}

export default App
