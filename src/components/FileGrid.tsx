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
    url: 'https://burst.shopifycdn.com/photos/anchor-bracelet-leather.jpg?width=150&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fanchor-bracelet-leather.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x',
  },
  {
    id: '5',
    name: 'watch-detail',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/a-close-up-of-luxury-watch.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fa-close-up-of-luxury-watch.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x',
  },
  {
    id: '6',
    name: 'sunglasses-lifestyle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/lined-black-sunglasses-on-a-pink-surface.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Flined-black-sunglasses-on-a-pink-surface.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&crop=center',
  },
  {
    id: '7',
    name: 'handbag-product',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/gold-zipper-on-black-fashion-backpack.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fgold-zipper-on-black-fashion-backpack.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&crop=center&height=300',
  },
  {
    id: '8',
    name: 'shoes-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/footwear-close-up-man-tying-shoelace.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Ffootwear-close-up-man-tying-shoelace.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
  },
  {
    id: '9',
    name: 'perfume-bottle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/black-glass-perfume-bottle-and-spritzer.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fblack-glass-perfume-bottle-and-spritzer.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
  },
  {
    id: '10',
    name: 'makeup-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/bright-eyeshadow-makeup.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fbright-eyeshadow-makeup.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
  },
  {
    id: '11',
    name: 'camera-equipment',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/camera-floating-on-grey-background.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fcamera-floating-on-grey-background.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
  },
  {
    id: '12',
    name: 'coffee-shop',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/coffee-shop-stalker.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fcoffee-shop-stalker.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
  },
  {
    id: '13',
    name: 'plant-arrangement',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/portrait-of-floral-arrangement-in-natural-light.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fportrait-of-floral-arrangement-in-natural-light.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
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
    <>
      <style>{thumbnailStyles}</style>
      <Grid columns={{xs: 2, sm: 4, md: 5, lg: 6, xl: 6}} gap={{xs: "0", sm: "0", md: "0", lg: "0", xl: "0"}}>
        {SAMPLE_FILES.map((file) => (
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
