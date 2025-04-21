import { LegacyCard, Grid, Text, Thumbnail } from '@shopify/polaris'

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
]

export function FileGrid() {
  return (
    <div style={{ padding: '20px' }}>
      <Grid gap="400">
        {SAMPLE_FILES.map((file) => (
          <Grid.Cell key={file.id} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
            <LegacyCard sectioned>
              <div style={{ textAlign: 'center' }}>
                <Thumbnail source={file.url} alt={file.name} size="large" />
                <Text as="p" variant="bodyMd">
                  {file.name}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  {file.extension}
                </Text>
              </div>
            </LegacyCard>
          </Grid.Cell>
        ))}
      </Grid>
    </div>
  )
}
