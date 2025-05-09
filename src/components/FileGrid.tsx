import { LegacyCard, Grid, Text, Thumbnail, Checkbox, Button, Box, BlockStack } from '@shopify/polaris'
import { ImageMagicIcon } from '@shopify/polaris-icons'
import { useState, useEffect } from 'react'
import './FileGrid.css'

// Add custom styles for the thumbnail
const thumbnailStyles = `
  .custom-thumbnail-container .Polaris-Thumbnail {
    width: 100% !important;
    height: 100% !important;
  }
  
  .custom-thumbnail-container .Polaris-Thumbnail img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }

  .file-hover-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .file-container:hover .file-hover-actions {
    opacity: 1;
  }

  .file-container {
    position: relative;
    transition: background-color 0.2s ease;
    border-radius: 4px;
    cursor: pointer;
  }

  .file-container:hover {
    background-color: var(--p-color-bg-surface-hover);
  }
`

export interface File {
  id: string;
  name: string;
  extension: string;
  url: string;
  highResUrl?: string; // Optional high-resolution URL
  variantUrl?: string; // Optional variant URL for generated images
}

interface FileGridProps {
  files: File[];
  onFileSelect?: (fileId: string) => void;
  selectedFiles?: string[];
  onGenerateVariation?: (file: File) => void;
  newFilesToHighlight?: string[]; // New prop for files that should be highlighted
}

export function FileGrid({ 
  files, 
  onFileSelect, 
  selectedFiles = [], 
  onGenerateVariation,
  newFilesToHighlight = [] 
}: FileGridProps) {
  const [newFiles, setNewFiles] = useState<Set<string>>(new Set())

  // Check for hideVariant URL parameter
  const hideVariant = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('hideVariant') === '1';

  useEffect(() => {
    if (newFilesToHighlight.length > 0) {
      setNewFiles(new Set(newFilesToHighlight))
      // Remove highlight after animation completes
      const timer = setTimeout(() => {
        setNewFiles(new Set())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [newFilesToHighlight])

  const handleFileSelect = (fileId: string) => {
    onFileSelect?.(fileId);
  }

  return (
    <Grid columns={{xs: 2, sm: 4, md: 5, lg: 6, xl: 6}} gap={{xs: "0", sm: "0", md: "0", lg: "0", xl: "0"}}>
      {files.map((file) => (
        <Grid.Cell key={file.id}>
          <Box>
            <div className={`file-container ${newFiles.has(file.id) ? 'highlight-new' : ''}`}>
              <div className="file-hover-actions">
                  {!hideVariant && (
                    <Button
                      icon={ImageMagicIcon}
                      onClick={() => onGenerateVariation?.(file)}
                      variant="tertiary"
                      size="slim"
                    />
                  )}
              </div>
              <Box padding="400">
                <BlockStack gap="200">
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      left: '8px',
                      zIndex: 1 
                    }}>
                      <Checkbox
                        label=""
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleFileSelect(file.id)}
                      />
                    </div>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      position: 'relative',
                      paddingTop: '100%' // This creates a square aspect ratio
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div className="custom-thumbnail-container" style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Thumbnail
                            source={file.url}
                            alt={file.name}
                            size="large"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <BlockStack gap="100" align="center">
                    <Text as="p" variant="bodyMd" fontWeight="medium" alignment="center">
                      {file.name}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                      {file.extension}
                    </Text>
                  </BlockStack>
                </BlockStack>
              </Box>
            </div>
          </Box>
        </Grid.Cell>
      ))}
    </Grid>
  )
}
