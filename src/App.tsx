import { Button, Icon } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { useState } from 'react'
import { FilePicker } from './components/FilePicker'
import './components/Placeholder.css'

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
      <div 
        onClick={() => setIsOpen(true)}
        className="file-picker-placeholder"
      >
        <Icon source={PlusIcon} />
      </div>
      <FilePicker open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
