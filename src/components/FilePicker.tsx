import {
  Modal,
  TextField,
  ButtonGroup,
  Button,
  BlockStack,
  ActionList,
  Popover,
  Box,
  Badge,
  DropZone,
  InlineStack,
  Text,
  Icon,
  Spinner,
  Tooltip,
} from '@shopify/polaris'
import {
  ChevronDownIcon,
  SortIcon,
  ViewIcon,
  FilterIcon,
  SearchIcon,
  FolderIcon,
  ImageIcon,
  AppsIcon,
  ArrowLeftIcon,
  ImageMagicIcon,
  UndoIcon,
  FlagIcon,
  ImportIcon,
} from '@shopify/polaris-icons'
import { useState, useEffect, useRef } from 'react'
import { FileGrid } from './FileGrid'
import { ImageLoader } from './ImageLoader'
import { ImagePreview } from './ImagePreview'
import './FilePicker.css'

interface FilePickerProps {
  open: boolean
  onClose: () => void
}

export function FilePicker({ open, onClose }: FilePickerProps) {
  const [searchValue, setSearchValue] = useState('')
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isGenerateMode, setIsGenerateMode] = useState(false)
  const [promptValue, setPromptValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [isPostImageLoad, setIsPostImageLoad] = useState(false)
  const magicButtonRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionHeight, setSectionHeight] = useState<number | null>(null)
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Measure section height when component mounts and when open changes
  useEffect(() => {
    if (open && sectionRef.current && !isGenerateMode) {
      const height = sectionRef.current.offsetHeight
      setSectionHeight(height)
    }
  }, [open, isGenerateMode])

  const toggleActionsPopover = () => setActionsPopoverActive(!actionsPopoverActive)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handlePromptChange = (value: string) => {
    setPromptValue(value)
  }

  const handleGenerateClick = () => {
    if (magicButtonRef.current) {

      // console.log('magicButtonRef.current', magicButtonRef.current)
      const modalSection = document.querySelector('.Polaris-Modal-Section > section.Polaris-Box')
      if (modalSection) {
        const buttonRect = magicButtonRef.current.getBoundingClientRect()
        const modalRect = modalSection.getBoundingClientRect()

        //console.log('modalSection', modalSection)
        
        // Calculate position relative to the modal section
        const relativeTop = buttonRect.top - modalRect.top
        const relativeLeft = buttonRect.left - modalRect.left

        //console.log(relativeLeft, relativeTop)
        
        setButtonPosition({ top: relativeTop, left: relativeLeft })
        
        magicButtonRef.current.classList.add('expand')
        
        setTimeout(() => {
          setIsGenerateMode(true)
        }, 300)
      }
    }
  }

  const handleBackClick = () => {
    if (magicButtonRef.current) {
      magicButtonRef.current.classList.remove('expand')
    }
    
    setTimeout(() => {
      setIsGenerateMode(false)
      setButtonPosition(null)
      // Reset generated image and loading state when going back
      setGeneratedImage(null)
      setIsLoading(false)
      setIsCollapsing(false)
    }, 300)
  }

  const handleBadgeClick = (badgeText: string) => {
    setPromptValue(badgeText)
    
    // If there's already an image, collapse it first
    if (generatedImage) {
      setIsCollapsing(true)
      setTimeout(() => {
        setGeneratedImage(null)
        setIsCollapsing(false)
        setIsLoading(true)
        setIsPostImageLoad(false)
      }, 300)
    } else {
      setIsLoading(true)
      setIsPostImageLoad(false)
    }
    
    // Simulate loading for 5 seconds then show the image
    setTimeout(() => {
      setIsLoading(false)
      setGeneratedImage('https://burst.shopifycdn.com/photos/closeup-of-clover-leaves.jpg?width=1850&format=pjpg&exif=0&iptc=0')
      setIsPostImageLoad(true)
    }, 7000)
  }

  const handleStopGeneration = () => {
    setIsLoading(false)
    setGeneratedImage(null)
    setPromptValue("")
  }

  const handlePreviewClick = () => {
    setIsPreviewMode(true)
  }

  const handleClosePreview = () => {
    setIsPreviewMode(false)
  }

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'generated-image.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleReportImage = () => {
    // Implement report functionality
    console.log('Report image clicked')
  }

  const handleTryAgain = () => {
    setIsPreviewMode(false)
    setGeneratedImage(null)
    setIsLoading(true)
    setIsPostImageLoad(false)
    
    // Simulate loading for 5 seconds then show the image
    setTimeout(() => {
      setIsLoading(false)
      setGeneratedImage('https://burst.shopifycdn.com/photos/closeup-of-clover-leaves.jpg?width=1850&format=pjpg&exif=0&iptc=0')
      setIsPostImageLoad(true)
    }, 500)
  }

  // Reset state when modal is closed
  useEffect(() => {
    if (!open) {
      setIsGenerateMode(false)
      setButtonPosition(null)
      setGeneratedImage(null)
      setIsLoading(false)
      setIsCollapsing(false)
      setIsPostImageLoad(false)
    }
  }, [open])

  // Add a useEffect to handle the padding removal when in generate mode
  useEffect(() => {
    if (isGenerateMode) {
      const modalSection = document.querySelector('.Polaris-Modal-Section > section.Polaris-Box')
      if (modalSection) {
        const originalStyle = modalSection.getAttribute('style')
        modalSection.setAttribute('style', '--pc-box-padding-block-start-xs: 0 !important; --pc-box-padding-block-end-xs: 0 !important; --pc-box-padding-inline-start-xs: 0 !important; --pc-box-padding-inline-end-xs: 0 !important; position: relative !important;')
        modalSection.setAttribute('data-original-style', originalStyle || '')
      }
    } else {
      const modalSection = document.querySelector('.Polaris-Modal-Section > section.Polaris-Box')
      if (modalSection) {
        const originalStyle = modalSection.getAttribute('data-original-style')
        if (originalStyle) {
          modalSection.setAttribute('style', originalStyle)
        }
      }
    }
  }, [isGenerateMode])

  const actionBarMarkup = (
    <Box background="bg-surface">
      <InlineStack align="space-between" blockAlign="center">
        <div style={{ maxWidth: '320px', flex: 1 }}>
          <TextField
            label="Search"
            labelHidden
            value={searchValue}
            onChange={handleSearchChange}
            prefix={<Icon source={SearchIcon} />}
            placeholder="Search files"
            autoComplete="off"
          />
        </div>
        <ButtonGroup>
          <Button icon={FilterIcon}>Filter</Button>
          <Button icon={SortIcon}>Sort</Button>
        </ButtonGroup>
      </InlineStack>
    </Box>
  )

  const uploadActionsMarkup = (
    <Box paddingBlock="800">
      <Box>
        <BlockStack gap="100">
          <InlineStack align="center" blockAlign="center" gap="400">
            <ButtonGroup variant="segmented">
              <Button>Upload files</Button>
              <Button icon={ChevronDownIcon} accessibilityLabel="Create folder" />
            </ButtonGroup>
            <div onClick={(e) => e.stopPropagation()}>
              <div className={`magic-button ${isGenerateMode ? 'expand' : ''}`} ref={magicButtonRef}>
                <Button onClick={handleGenerateClick} icon={ImageMagicIcon}>Generate image</Button>
              </div>
            </div>
          </InlineStack>
          <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
            Drag and drop images, videos, 3D models, and files
          </Text>
        </BlockStack>
      </Box>
    </Box>
  )

  return (
    <div className={`custom-modal ${isGenerateMode ? 'generate-mode' : ''}`}>
      <Modal
        open={open}
        onClose={onClose}
        noScroll
        title={
          <div className={`modal-title ${isGenerateMode ? 'with-back-button' : ''}`}>
            <InlineStack align="center" gap="200">
              {isGenerateMode && (
                <Button
                  icon={ArrowLeftIcon}
                  onClick={handleBackClick}
                  variant="tertiary"
                  accessibilityLabel="Back"
                />
              )}
              <Text as="span" variant="headingMd">
                {isGenerateMode ? "Generate image" : "Select files"}
              </Text>
            </InlineStack>
          </div>
        }
        size="large"
        primaryAction={{
          content: 'Done',
          onAction: onClose,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: onClose,
          },
        ]}
      >
        <Modal.Section>
          <div 
            ref={sectionRef}
            className={`modal-content ${isGenerateMode ? 'generate-mode-content' : ''}`}
            style={{
              height: '800px',
              ...(isGenerateMode && {
                overflow: 'hidden',
                padding: '20px'
              })
            }}
          >
            <div className={`action-bar-container ${isGenerateMode ? 'fade-out' : ''}`}>
              {!isGenerateMode && (
                <Box paddingBlockEnd="400">
                  {actionBarMarkup}
                </Box>
              )}
            </div>
            
            {isGenerateMode && (
              <div className={`generate-mode-container ${isGenerateMode && !isLoading && !generatedImage ? 'animate-padding' : ''} ${(isLoading || generatedImage) ? 'no-padding' : ''}`}>
               
               <Box>
                <BlockStack gap="400">
                  {isLoading ? (
                    <div className={`loading-container ${isLoading ? 'animate' : ''}`}>
                      <Box>
                        <BlockStack gap="400" align="center">
                          <ImageLoader prompt={promptValue} />
                        </BlockStack>
                      </Box>
                    </div>
                  ) : generatedImage ? (
                    <div className={`image-container ${generatedImage ? 'animate' : ''} ${isCollapsing ? 'collapse' : ''}`}>
                      <Box>
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={generatedImage} 
                            alt="Generated image" 
                            style={{ 
                              width: '100%', 
                              borderRadius: '8px',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                            <Tooltip content="Report image">
                              <div className="image-action-button">
                                <Button
                                  icon={FlagIcon}
                                  variant="tertiary"
                                  size="medium"
                                />
                              </div>
                            </Tooltip>
                          </div>
                          <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                            <InlineStack gap="300">
                              <Tooltip content="Download">
                                <div className="image-action-button">
                                  <Button
                                    icon={ImportIcon}
                                    variant="tertiary"
                                    size="medium"
                                  />
                                </div>
                              </Tooltip>
                              <Tooltip content="Preview generated image">
                                <div className="image-action-button">
                                  <Button
                                    icon={ViewIcon}
                                    variant="tertiary"
                                    size="medium"
                                    onClick={handlePreviewClick}
                                  />
                                </div>
                              </Tooltip>
                            </InlineStack>
                          </div>
                        </div>
                      </Box>
                    </div>
                  ) : null}

                  <div className="generate-mode-input">
                    <div className="faux-input">
                      <InlineStack wrap={false} blockAlign="center" align="space-between">
                        <InlineStack gap="200" wrap={false} blockAlign="center">
                          <Box>
                            <Icon source={ImageMagicIcon} tone="magic" />
                          </Box>
                          
                          <TextField
                            label="Prompt"
                            labelHidden
                            autoComplete="off"
                            placeholder="Describe what you want to see"
                            value={promptValue}
                            onChange={handlePromptChange}
                            disabled={isLoading}
                          />
                        </InlineStack>

                        <Box>
                          {isLoading ? (
                            <Button size="slim" onClick={handleStopGeneration}>Stop</Button>
                          ) : generatedImage ? (
                            <Button size="slim" icon={UndoIcon}>Try again</Button>
                          ) : (
                            <Button size="slim">Generate</Button>
                          )}
                        </Box>
                      </InlineStack>
                    </div>
                  </div>

                  {!isLoading && !generatedImage && (
                    <Box paddingBlockEnd="400">
                      <InlineStack gap="200">
                        <div onClick={() => handleBadgeClick("lush green leaves")} style={{ cursor: 'pointer' }}>
                          <Badge>lush green leaves</Badge>
                        </div>
                        <div onClick={() => handleBadgeClick("Colorful gradient background")} style={{ cursor: 'pointer' }}>
                          <Badge>Colorful gradient background</Badge>
                        </div>
                        <div onClick={() => handleBadgeClick("A gradient that reflects the colors of the ocean")} style={{ cursor: 'pointer' }}>
                          <Badge>A gradient that reflects the colors of the ocean</Badge>
                        </div>
                        <div onClick={() => handleBadgeClick("White marble background with subtle gray veining")} style={{ cursor: 'pointer' }}>
                          <Badge>White marble background with subtle gray veining</Badge>
                        </div>
                      </InlineStack>
                    </Box>
                  )}

                  {isPostImageLoad && (
                    <Box paddingBlockEnd="400">
                      <InlineStack gap="200">
                        <div onClick={() => handleBadgeClick("Various leaf textures and patterns")} style={{ cursor: 'pointer' }}>
                          <Badge>Various leaf textures and patterns</Badge>
                        </div>
                        <div onClick={() => handleBadgeClick("Green leaves intertwined with sustainable packaging materials")} style={{ cursor: 'pointer' }}>
                          <Badge>Green leaves intertwined with sustainable packaging materials</Badge>
                        </div>
                        <div onClick={() => handleBadgeClick("Aerial view of a dense forest canopy")} style={{ cursor: 'pointer' }}>
                          <Badge>Aerial view of a dense forest canopy</Badge>
                        </div>
                      </InlineStack>
                    </Box>
                  )}
                </BlockStack>
               </Box>
              </div>
            )}
            
            <div className={`upload-actions-container ${isGenerateMode ? 'fade-out' : ''}`}>
              <Box paddingBlockEnd="400">
                {!isGenerateMode && (
                  <DropZone onDrop={() => {}}>
                    {uploadActionsMarkup}
                  </DropZone>
                )}
              </Box>
            </div>
            
            <div className={`file-grid-container ${isGenerateMode ? 'fade-out' : ''}`}>
              <Box>
                <FileGrid />
              </Box>
            </div>
          </div>
        </Modal.Section>
      </Modal>

      {isPreviewMode && generatedImage && (
        <ImagePreview
          imageUrl={generatedImage}
          onClose={handleClosePreview}
          onDownload={handleDownloadImage}
          onReport={handleReportImage}
          onTryAgain={handleTryAgain}
        />
      )}
    </div>
  )
}
