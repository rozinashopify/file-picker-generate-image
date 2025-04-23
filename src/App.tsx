import { Button, Icon } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { useState } from 'react'
import { FilePicker } from './components/FilePicker'
import { File } from './components/FileGrid'
import './components/Placeholder.css'

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setIsOpen(false)
  }

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
        {selectedFile ? (
          <img 
            src={selectedFile.url} 
            alt={selectedFile.name}
          />
        ) : (
          <Icon source={PlusIcon} />
        )}
      </div>
      <FilePicker 
        open={isOpen} 
        onClose={() => setIsOpen(false)} 
        onFileSelect={handleFileSelect}
      />
    </div>
  )
}
