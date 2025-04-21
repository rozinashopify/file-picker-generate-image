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
} from '@shopify/polaris-icons'
import { useState } from 'react'
import { FileGrid } from './FileGrid'

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
      padding="300"
      borderBlockEndWidth="025"
      borderColor="border"
      background="bg-surface"
    >
      <LegacyStack alignment="center" distribution="equalSpacing">
        <div style={{ maxWidth: '320px', flex: 1 }}>
          <TextField
            label="Search files"
            value={searchValue}
            onChange={handleSearchChange}
            prefix={<Icon source={SearchIcon} />}
            placeholder="Search for files..."
            autoComplete="off"
            helpText="Enter keywords to search through your files"
          />
        </div>
        <ButtonGroup>
          <Button icon={FilterIcon}>Filter</Button>
          <Button icon={SortIcon}>Sort</Button>
          <ButtonGroup variant="segmented">
            <Button
              pressed={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              icon={ViewIcon}
            />
            <Button
              pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              icon={ViewIcon}
            />
          </ButtonGroup>
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
    <Modal
      open={open}
      onClose={onClose}
      title="Select files"
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
        {actionBarMarkup}
        <DropZone onDrop={() => {}}>
          {uploadActionsMarkup}
          <FileGrid />
        </DropZone>
      </Modal.Section>
    </Modal>
  )
}
