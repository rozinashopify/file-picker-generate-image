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
  ViewMajorIcon,
  ContentIcon,
  FilterIcon,
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
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search files"
            autoComplete="off"
          />
        </div>
        <ButtonGroup>
          <Button icon={FilterIcon}>Filter</Button>
          <Button icon={SortIcon}>Sort</Button>
          <ButtonGroup segmented>
            <Button
              pressed={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              icon={ViewMajorIcon}
            />
            <Button
              pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              icon={ContentIcon}
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
          <Button>Add files</Button>
          <Popover
            active={actionsPopoverActive}
            activator={
              <Button onClick={toggleActionsPopover} icon={ChevronDownIcon} />
            }
            onClose={toggleActionsPopover}
          >
            <ActionList
              actionRole="menuitem"
              items={[{ content: 'Add from URL' }]}
            />
          </Popover>
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
