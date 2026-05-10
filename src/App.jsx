import { useRef } from 'react'
import Orb from './Orb'

export default function App() {
  const bgRef = useRef(null)
  return (
    <div ref={bgRef} className="w-screen h-screen overflow-hidden" style={{
      background: '#F0EBD6',
      backgroundImage: [
        'linear-gradient(rgba(255,255,255,0.6) 2px, transparent 2px)',
        'linear-gradient(90deg, rgba(255,255,255,0.6) 2px, transparent 2px)',
      ].join(', '),
      backgroundSize: '40px 40px',
    }}>
      <Orb bgRef={bgRef} />
    </div>
  )
}
