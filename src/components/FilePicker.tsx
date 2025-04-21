import {
  Modal,
  TextField,
  ButtonGroup,
  Button,
  ActionList,
  Popover,
  Box,
  DropZone,
  LegacyStack,
  Text,
  Icon,
} from '@shopify/polaris'
import {
  ChevronDownIcon,
  SortIcon,
  ViewIcon,
  ListIcon,
  FilterIcon,
  SearchIcon,
  FolderIcon,
  ImageIcon,
  AppsIcon,
} from '@shopify/polaris-icons'
import { useState } from 'react'
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

  const toggleActionsPopover = () => setActionsPopoverActive(!actionsPopoverActive)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const actionBarMarkup = (
    <Box
      background="bg-surface"
    >
      <LegacyStack alignment="center" distribution="equalSpacing">
        <div style={{ maxWidth: '320px', flex: 1 }}>
          <TextField
            value={searchValue}
            onChange={handleSearchChange}
            prefix={<Icon source={SearchIcon} />}
            placeholder="Search for files..."
            autoComplete="off"
          />
        </div>
        <ButtonGroup>
          <Button icon={FilterIcon}>Filter</Button>
          <Button icon={SortIcon}>Sort</Button>
        </ButtonGroup>
      </LegacyStack>
    </Box>
  )

  const uploadActionsMarkup = (
    <Box padding="400">
      <LegacyStack distribution="center">
        <ButtonGroup variant="segmented">
          <Button>Upload files</Button>
          <Button>Create folder</Button>
        </ButtonGroup>
        <Button>Generate image</Button>
      </LegacyStack>
    </Box>
  )

  return (
    <div className="custom-modal">
      <Modal
        open={open}
        onClose={onClose}
        title="Select files"
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
          <Box paddingBlockEnd="400">
            {actionBarMarkup}
          </Box>
          <Box paddingBlockEnd="400">
            <DropZone onDrop={() => {}}>
              {uploadActionsMarkup}
            </DropZone>
          </Box>
          <Box>
            <FileGrid />
          </Box>
        </Modal.Section>
      </Modal>
    </div>
  )
}
