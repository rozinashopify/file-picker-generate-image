import {
  Modal,
  TextField,
  ButtonGroup,
  Button,
  BlockStack,
  ActionList,
  Popover,
  Box,
  DropZone,
  InlineStack,
  Text,
  Icon,
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
} from '@shopify/polaris-icons'
import { useState, useEffect, useRef } from 'react'
import { FileGrid } from './FileGrid'
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
  const [showGenerateInput, setShowGenerateInput] = useState(false)
  const magicButtonRef = useRef<HTMLDivElement>(null)

  const toggleActionsPopover = () => setActionsPopoverActive(!actionsPopoverActive)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handlePromptChange = (value: string) => {
    setPromptValue(value)
  }

  const handleGenerateClick = () => {
    // Add the expand class to the magic button
    if (magicButtonRef.current) {
      magicButtonRef.current.classList.add('expand');
    }
    
    // Set generate mode after a short delay to allow the button to expand
    setTimeout(() => {
      setIsGenerateMode(true);
      // Show the generate input after another short delay
      setTimeout(() => {
        setShowGenerateInput(true);
      }, 300);
    }, 300);
  }

  const handleBackClick = () => {
    setShowGenerateInput(false);
    
    // Remove the expand class from the magic button
    if (magicButtonRef.current) {
      magicButtonRef.current.classList.remove('expand');
    }
    
    // Add a small delay to allow the input to fade out before changing mode
    setTimeout(() => {
      setIsGenerateMode(false);
    }, 300);
  }

  // Reset state when modal is closed
  useEffect(() => {
    if (!open) {
      setIsGenerateMode(false)
      setShowGenerateInput(false)
    }
  }, [open])

  const actionBarMarkup = (
    <Box
      background="bg-surface"
    >
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
    <div className="custom-modal">
      <Modal
        open={open}
        onClose={onClose}
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
          <div className={`action-bar-container ${isGenerateMode ? 'fade-out' : ''}`}>
            {!isGenerateMode && (
              <Box paddingBlockEnd="400">
                {actionBarMarkup}
              </Box>
            )}
          </div>
          
          {/* Generate input container - separate from the upload-actions-container */}
          {isGenerateMode && showGenerateInput && (
            <div className="generate-mode-container">
              <Box paddingBlock="800">
                <div className="generate-input-container">
                  <TextField
                    label="Prompt"
                    labelHidden
                    value={promptValue}
                    onChange={handlePromptChange}
                    placeholder="Describe the image you want to generate..."
                    autoComplete="off"
                    multiline={3}
                  />
                  <Button variant="primary">Generate</Button>
                </div>
              </Box>
            </div>
          )}
          
          {/* Upload actions container - only visible in default mode */}
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
        </Modal.Section>
      </Modal>
    </div>
  )
}
