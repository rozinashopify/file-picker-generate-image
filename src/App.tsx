import { Button } from '@shopify/polaris'
import { useState } from 'react'
import { FilePicker } from './components/FilePicker'

export default function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100%'
    }}>
      <Button onClick={() => setIsOpen(true)}>Open File Picker</Button>
      <FilePicker open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
