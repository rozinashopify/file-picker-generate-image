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
} from '@shopify/polaris-icons';
import './ImagePreview.css';

interface ImagePreviewProps {
  imageUrl: string;
  onClose: () => void;
  onDownload: () => void;
  onReport: () => void;
  onTryAgain: () => void;
}

export function ImagePreview({
  imageUrl,
  onClose,
  onDownload,
  onReport,
  onTryAgain,
}: ImagePreviewProps) {
  return (
    <div className="image-preview-overlay">
      <div className="image-preview-container">
        {/* Top toolbar */}
        <div className="image-preview-toolbar">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <Button
                icon={ExitIcon}
                onClick={onClose}
                variant="tertiary"
                accessibilityLabel="Close preview"
              />
              <Text as="span" variant="headingMd">Preview generated image</Text>
            </InlineStack>
            <InlineStack gap="300">
              <Tooltip content="Download">
                <Button
                  icon={ImportIcon}
                  onClick={onDownload}
                  variant="tertiary"
                  accessibilityLabel="Download image"
                />
              </Tooltip>
              <Tooltip content="Report image">
                <Button
                  icon={FlagIcon}
                  onClick={onReport}
                  variant="tertiary"
                  accessibilityLabel="Report image"
                />
              </Tooltip>
              <Tooltip content="Try again">
                <Button
                  icon={UndoIcon}
                  onClick={onTryAgain}
                  variant="tertiary"
                  accessibilityLabel="Try again"
                />
              </Tooltip>
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