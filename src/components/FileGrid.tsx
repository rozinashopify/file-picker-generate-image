import { LegacyCard, Grid, Text, Thumbnail, Checkbox, Button, Box, BlockStack, InlineStack } from '@shopify/polaris'
import { useState } from 'react'

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
`

export interface File {
  id: string;
  name: string;
  extension: string;
  url: string;
}

interface FileGridProps {
  files: File[];
  onFileSelect?: (fileId: string) => void;
  selectedFiles?: string[];
}

export function FileGrid({ files, onFileSelect, selectedFiles = [] }: FileGridProps) {
  const handleFileSelect = (fileId: string) => {
    onFileSelect?.(fileId);
  }

  return (
    <>
      <style>{thumbnailStyles}</style>
      <Grid columns={{xs: 2, sm: 4, md: 5, lg: 6, xl: 6}} gap={{xs: "0", sm: "0", md: "0", lg: "0", xl: "0"}}>
        {files.map((file) => (
          <Grid.Cell key={file.id}>
            <Box>
              <div 
                style={{ 
                  position: 'relative',
                  transition: 'background-color 0.2s ease',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--p-color-bg-surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
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
    </>
  )
}
