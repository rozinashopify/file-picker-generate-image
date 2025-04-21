import { LegacyCard, Grid, Text, Thumbnail, Checkbox, Button, Box, BlockStack, InlineStack } from '@shopify/polaris'
import { useState } from 'react'

const SAMPLE_FILES = [
  {
    id: '1',
    name: 'product-front',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg',
  },
  {
    id: '2',
    name: 'product-side',
    extension: 'PNG',
    url: 'https://burst.shopifycdn.com/photos/tucan-scarf_373x@2x.jpg',
  },
  {
    id: '3',
    name: 'lifestyle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/black-orange-stripes_373x@2x.jpg',
  },
  {
    id: '4',
    name: 'jewelry-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/bracelet-jewelry-gold_373x@2x.jpg',
  },
  {
    id: '5',
    name: 'watch-detail',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/luxury-watch-timepiece_373x@2x.jpg',
  },
  {
    id: '6',
    name: 'sunglasses-lifestyle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/woman-wearing-sunglasses_373x@2x.jpg',
  },
  {
    id: '7',
    name: 'handbag-product',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/leather-handbag-fashion_373x@2x.jpg',
  },
  {
    id: '8',
    name: 'shoes-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/sneakers-collection_373x@2x.jpg',
  },
  {
    id: '9',
    name: 'perfume-bottle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/luxury-perfume-bottle_373x@2x.jpg',
  },
  {
    id: '10',
    name: 'makeup-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/makeup-products-beauty_373x@2x.jpg',
  },
  {
    id: '11',
    name: 'camera-equipment',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/camera-equipment-photography_373x@2x.jpg',
  },
  {
    id: '12',
    name: 'coffee-shop',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/coffee-shop-interior_373x@2x.jpg',
  },
  {
    id: '13',
    name: 'plant-arrangement',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/indoor-plants-arrangement_373x@2x.jpg',
  }
]

export function FileGrid() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    )
  }

  return (
    <Grid>
      {SAMPLE_FILES.map((file) => (
        <Grid.Cell key={file.id} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
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
                <BlockStack gap="400">
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
                      height: '200px',
                      overflow: 'hidden',
                      borderRadius: '4px'
                    }}>
                      <Thumbnail
                        source={file.url}
                        alt={file.name}
                        size="large"
                      />
                    </div>
                  </div>
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="200">
                      <Text as="p" variant="bodyMd" fontWeight="medium">
                        {file.name}
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {file.extension}
                      </Text>
                    </BlockStack>
                    <Button size="slim" onClick={() => window.open(file.url, '_blank')}>
                      Preview
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Box>
            </div>
          </Box>
        </Grid.Cell>
      ))}
    </Grid>
  )
}
