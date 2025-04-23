import React from 'react';
import {
  Box,
  Button,
  Icon,
  InlineStack,
  Text,
  Tooltip,
} from '@shopify/polaris';
import {
  ExitIcon,
  ImportIcon,
  FlagIcon,
  ViewIcon,
  UndoIcon,
  InfoIcon,
  SaveIcon,
} from '@shopify/polaris-icons';
import './ImagePreview.css';

interface ImagePreviewProps {
  imageUrl: string;
  onClose: () => void;
  onDownload: () => void;
  onReport: () => void;
  onTryAgain: () => void;
  onSaveToFiles: (fromPreview?: boolean) => void;
}

export function ImagePreview({
  imageUrl,
  onClose,
  onDownload,
  onReport,
  onTryAgain,
  onSaveToFiles,
}: ImagePreviewProps) {
  return (
    <div className="image-preview-overlay">
      <div className="image-preview-container">
        {/* Top toolbar */}
        <div className="image-preview-toolbar">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <div className="tooltip-wrapper">
                <Button
                  icon={ExitIcon}
                  onClick={onClose}
                  variant="tertiary"
                  accessibilityLabel="Close preview"
                />
                <div className="tooltip-label">Close preview</div>
              </div>
              <Text as="span" variant="headingMd">Preview generated image</Text>
            </InlineStack>
            <InlineStack gap="300">
              <Button
                size="large"
                icon={ImportIcon}
                onClick={onDownload}
                variant="tertiary"
                accessibilityLabel="Download image"
              />
              <div className="save-to-files">
                <Button 
                  variant="secondary"
                  size="large"
                  onClick={() => onSaveToFiles(true)}>Save to Files</Button>
              </div>
            </InlineStack>
          </InlineStack>
        </div>

        {/* Main content area */}
        <div className="image-preview-content">
          <div className="image-preview-main">
            <img src={imageUrl} alt="Preview" className="preview-image" />
          </div>
          
          {/* Floating sidebar */}
          <div className="image-preview-sidebar">
            <Box padding="400">
              
                <InlineStack align="start" gap="200">
                    <Icon source={InfoIcon} />
                    <Text as="h2" variant="headingMd">Information</Text>
                </InlineStack>
              <Box paddingBlockStart="200">
                <Text as="p" variant="bodyMd" fontWeight="bold">Prompt</Text>
                <Text as="p" variant="bodyMd" tone="subdued">lush green leaves</Text>
              </Box>
              <Box paddingBlockStart="200">
                <Text as="p" variant="bodyMd" fontWeight="bold">Expires in</Text>
                <Text as="p" variant="bodyMd" tone="subdued">7 days</Text>
              </Box>
              <Box paddingBlockStart="200">
                <Text as="p" variant="bodyMd" fontWeight="bold">Details</Text>
                <Text as="p" variant="bodyMd" tone="subdued">JPG | 1920 x 1080 | 1.08 MB</Text>
              </Box>
              
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
} 