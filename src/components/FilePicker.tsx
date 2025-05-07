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
  ArrowUpIcon,
  DragHandleIcon,
} from '@shopify/polaris-icons'
import { useState, useEffect, useRef } from 'react'
import { FileGrid, File } from './FileGrid'
import { ImageLoader } from './ImageLoader'
import { ImagePreview } from './ImagePreview'
import './FilePicker.css'
import tabIcon from './tab.svg'
import sidekickAvatarBlink from './sidekickAvatarBlink.svg'
import sidekickAvatarThink from './sidekickAvatarThink.svg'
import sidekickAvatar from './sidekickAvatar.svg'
import { IconSource } from '@shopify/polaris'

// File-specific improvement messages
const FILE_IMPROVEMENTS: Record<string, string> = {
  '1': 'make the necklace more elegant with a golden finish',
  '2': 'add a warm, cozy texture to the scarf',
  '3': 'enhance the contrast of the stripes',
  '4': 'add a vintage filter to the jewelry collection',
  '5': 'make the watch face more luxurious with a metallic sheen',
  '6': 'add a summer vibe to the sunglasses shot',
  '7': 'give the backpack a premium leather look',
  '8': 'add a lifestyle context to the shoes',
  '9': 'create a luxurious atmosphere around the perfume bottle',
  '10': 'enhance the makeup colors to be more vibrant',
  '11': 'add a professional studio lighting effect',
  '12': 'create a cozy coffee shop atmosphere',
  '13': 'add a soft, natural glow to the plant arrangement'
}

// Sample files data
const SAMPLE_FILES: File[] = [
  {
    id: '1',
    name: 'product-front',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg',
    highResUrl: 'https://burst.shopifycdn.com/photos/black-leather-choker-necklace.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464552386984a97347-elegant-gold-choker-necklace.png?v=1746455284'
  },
  {
    id: '2',
    name: 'product-side',
    extension: 'PNG',
    url: 'https://burst.shopifycdn.com/photos/tucan-scarf_373x@2x.jpg',
    highResUrl: 'https://burst.shopifycdn.com/photos/tucan-scarf.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464553289133a6b05c-tropical-bird-patterned-fabric.png?v=1746455431'
  },
  {
    id: '3',
    name: 'lifestyle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/black-orange-stripes_373x@2x.jpg',
    highResUrl: 'https://burst.shopifycdn.com/photos/black-orange-stripes.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464554234904b1e589-vivid-striped-patterns-enhanced-contrast-for-dynamic-visual-impact.png?v=1746455607'
  },
  {
    id: '4',
    name: 'jewelry-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/anchor-bracelet-leather.jpg?width=150&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fanchor-bracelet-leather.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x',
    highResUrl: 'https://burst.shopifycdn.com/photos/anchor-bracelet-leather.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464554940161d76904-elegant-leather-and-gold-bracelet.png?v=1746455607'
  },
  {
    id: '5',
    name: 'watch-detail',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/a-close-up-of-luxury-watch.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fa-close-up-of-luxury-watch.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x',
    highResUrl: 'https://burst.shopifycdn.com/photos/a-close-up-of-luxury-watch.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-174645562505438608bc-elegant-blue-dial-watch-on-a-wrist.png?v=1746455687'
  },
  {
    id: '6',
    name: 'sunglasses-lifestyle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/lined-black-sunglasses-on-a-pink-surface.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Flined-black-sunglasses-on-a-pink-surface.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/lined-black-sunglasses-on-a-pink-surface.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464557163794b0454d-vibrant-summer-vibes-sunglasses-on-a-beach-with-sunlight-and-tropical-background.png?v=1746455788'
  },
  {
    id: '7',
    name: 'handbag-product',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/gold-zipper-on-black-fashion-backpack.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fgold-zipper-on-black-fashion-backpack.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&crop=center&height=300',
    highResUrl: 'https://burst.shopifycdn.com/photos/gold-zipper-on-black-fashion-backpack.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464557804264a9a221-sleek-black-leather-backpack-with-gold-accents.png?v=1746455906'
  },
  {
    id: '8',
    name: 'shoes-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/footwear-close-up-man-tying-shoelace.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Ffootwear-close-up-man-tying-shoelace.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/footwear-close-up-man-tying-shoelace.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464558981649607a7-man-tying-brown-leather-shoes-on-wooden-path.png?v=1746456005'
  },
  {
    id: '9',
    name: 'perfume-bottle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/black-glass-perfume-bottle-and-spritzer.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fblack-glass-perfume-bottle-and-spritzer.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/black-glass-perfume-bottle-and-spritzer.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-174645599815147a836e-elegant-perfume-bottle-with-gold-and-black-theme.png?v=1746456090'
  },
  {
    id: '10',
    name: 'makeup-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/bright-eyeshadow-makeup.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fbright-eyeshadow-makeup.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/bright-eyeshadow-makeup.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464560838584b19eaf-vibrant-makeup-palette-with-neon-colors.png?v=1746456142'
  },
  {
    id: '11',
    name: 'camera-equipment',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/camera-floating-on-grey-background.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fcamera-floating-on-grey-background.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/camera-floating-on-grey-background.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-174645613570088501a-suspended-camera-in-dramatic-lighting.png?v=1746456210'
  },
  {
    id: '12',
    name: 'coffee-shop',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/coffee-shop-stalker.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fcoffee-shop-stalker.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/coffee-shop-stalker.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-17464562045383a75c2c-cozy-bakery-interior-at-night.png?v=1746456332'
  },
  {
    id: '13',
    name: 'plant-arrangement',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/portrait-of-floral-arrangement-in-natural-light.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fportrait-of-floral-arrangement-in-natural-light.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/portrait-of-floral-arrangement-in-natural-light.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/shopp-e-1746456311735508f0f4-radiant-plant-arrangement-with-a-soft-natural-glow.png?v=1746456352'
  }
]

interface FilePickerProps {
  open: boolean
  onClose: () => void
  onFileSelect: (file: File) => void
}

interface RightIconButtonProps extends Omit<React.ComponentProps<typeof Button>, 'icon'> {
  icon: IconSource;
}

const RightIconButton = ({ children, icon, ...props }: RightIconButtonProps) => (
  <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
    <Button {...props}>{children}</Button>
    <div style={{ marginRight: '8px' }}>
      <Icon source={icon} />
    </div>
  </div>
);

export function FilePicker({ open, onClose, onFileSelect }: FilePickerProps) {
  const [searchValue, setSearchValue] = useState('')
  const [actionsPopoverActive, setActionsPopoverActive] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isGenerateMode, setIsGenerateMode] = useState(false)
  const [promptValue, setPromptValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [isPostImageLoad, setIsPostImageLoad] = useState(false)
  const [files, setFiles] = useState<File[]>(SAMPLE_FILES)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [newFilesToHighlight, setNewFilesToHighlight] = useState<string[]>([])
  const [highlightedFiles, setHighlightedFiles] = useState<Set<string>>(new Set())
  const [isArrowHovered, setIsArrowHovered] = useState(false)
  const magicButtonRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionHeight, setSectionHeight] = useState<number | null>(null)
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [fromVariant, setFromVariant] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState(sidekickAvatarBlink)
  const [isFooterVisible, setIsFooterVisible] = useState(true)
  const [isGridHovered, setIsGridHovered] = useState(false)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const fileGridRef = useRef<HTMLDivElement>(null)

  // On mount, read the query parameter
  // Removed useEffect for buttonVariant

  // Measure section height when component mounts and when open changes
  useEffect(() => {
    if (open && sectionRef.current && !isGenerateMode) {
      const height = sectionRef.current.offsetHeight
      setSectionHeight(height)
    }
  }, [open, isGenerateMode])

  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => {
        setCurrentAvatar(prev => prev === sidekickAvatarBlink ? sidekickAvatar : sidekickAvatarBlink)
      }, 1200)
      
      return () => clearInterval(timer)
    }
  }, [isLoading])

  const toggleActionsPopover = () => setActionsPopoverActive(!actionsPopoverActive)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handlePromptChange = (value: string) => {
    setPromptValue(value)
  }

  const handleTabKeyPress = (event: React.KeyboardEvent) => {
    console.log('handleTabKeyPress called')
    if (event.key === 'Tab' && !isLoading) {
      event.preventDefault()
      if (fromVariant && originalImage) {
        // For variant generation, use the predefined improvement
        const improvement = FILE_IMPROVEMENTS[originalImage.id] || ''
        console.log('Setting prompt value to improvement:', improvement)
        setPromptValue(improvement)
      } else if (generatedImage) {
        setPromptValue('add a magical glow to the leaves')
      } else {
        // For new image generation, use the default suggestion
        setPromptValue('lush green leaves')
      }
    }
  }

  const handleGenerateClick = () => {
    setFromVariant(false)
    setIsGenerateMode(true)
    setOriginalImage(null)
    setPromptValue('')
    setGeneratedImage(null)
    setIsLoading(false)
    setIsCollapsing(false)
    setIsFooterVisible(false)
    
    // Find the modal footer and add a class to it
    setTimeout(() => {
      const footer = document.querySelector('.Polaris-Modal-Dialog__Modal>.Polaris-InlineStack');
      if (footer) {
        footer.classList.remove('modal-footer-fade-in');
        footer.classList.add('modal-footer-fade-out');
      }
    }, 50);
  }

  const handleBackClick = () => {
    if (magicButtonRef.current) {
      magicButtonRef.current.classList.remove('expand')
    }
    
    // Set isCollapsing to true to trigger the collapsing animation
    setIsCollapsing(true)
    setIsFooterVisible(true)
    
    // Find the modal footer and add the fade-in class
    const footer = document.querySelector('.Polaris-Modal-Dialog__Modal>.Polaris-InlineStack');
    if (footer) {
      footer.classList.remove('modal-footer-fade-out');
      footer.classList.add('modal-footer-fade-in');
    }
    
    // Add a small delay to ensure the animation is visible
    setTimeout(() => {
      setIsGenerateMode(false)
      setButtonPosition(null)
      // Reset generated image and loading state when going back
      setGeneratedImage(null)
      setIsLoading(false)
      setIsCollapsing(false)
      setOriginalImage(null)
      setFromVariant(false)
    }, 30)
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
    
    // Add delay before showing the loading animation
    setTimeout(() => {
      // Simulate loading for 5 seconds then show the image
      setTimeout(() => {
        setIsLoading(false)
        setGeneratedImage('https://burst.shopifycdn.com/photos/closeup-of-clover-leaves.jpg?width=1850&format=pjpg&exif=0&iptc=0')
        setIsPostImageLoad(true)
      }, 7000)
    }, 2000)
  }

  const handleStopGeneration = () => {
    setIsLoading(false)
    setGeneratedImage(null)
    setPromptValue("")
  }

  const handleGenerateButtonClick = () => {
    console.log('handleGenerateButtonClick called with originalImage:', originalImage);
    
    // If there's already an image, collapse it first
    if (generatedImage) {
      console.log('Collapsing existing image');
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
    
    // Add delay before showing the loading animation
    setTimeout(() => {
      // Simulate loading for 5 seconds then show the image
      setTimeout(() => {
        setIsLoading(false)
        if (originalImage?.variantUrl) {
          console.log('Using variantUrl from originalImage:', originalImage.variantUrl);
          setGeneratedImage(originalImage.variantUrl)
        } else {
          console.log('Using default image URL');
          setGeneratedImage('https://burst.shopifycdn.com/photos/closeup-of-clover-leaves.jpg?width=1850&format=pjpg&exif=0&iptc=0')
        }
        setIsPostImageLoad(true)
        // Removed setPromptValue("") to preserve the prompt for naming
      }, 7000)
    }, 2000)
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
    setPromptValue("")
    
    // Simulate loading for 5 seconds then show the image
    setTimeout(() => {
      setIsLoading(false)
      if (originalImage?.variantUrl) {
        setGeneratedImage(originalImage.variantUrl)
      } else {
        setGeneratedImage('https://burst.shopifycdn.com/photos/closeup-of-clover-leaves.jpg?width=1850&format=pjpg&exif=0&iptc=0')
      }
      setIsPostImageLoad(true)
    }, 500)
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [fileId] // Only allow one file to be selected at a time
    )
  }

  const handleSaveToFiles = (fromPreview = false) => {
    if (generatedImage) {
      console.log('Starting handleSaveToFiles with prompt:', promptValue);
      console.log('Original image:', originalImage);
      
      // Generate a custom name based on the prompt
      const generateCustomName = (prompt: string) => {
        console.log('generateCustomName called with prompt:', prompt);
        
        if (!prompt) {
          console.log('No prompt provided, returning default name');
          return 'generated-image';
        }
        
        // Clean up the prompt and create a meaningful name
        const cleanPrompt = prompt
          .toLowerCase()
          // Remove common words and articles
          .replace(/\b(make|add|create|enhance|give|the|a|an|and|or|but|in|on|at|to|for|with|by|it|more|very|much|so|such|as|like|than|that|this|these|those)\b/g, '')
          // Remove special characters
          .replace(/[^a-z0-9\s-]/g, '')
          .trim();
          
        console.log('After initial cleaning:', cleanPrompt);
        
        // Split into words and process
        const words = cleanPrompt.split(/\s+/)
          .filter(word => word.length > 2)
          .slice(0, 4);
          
        console.log('Processed words:', words);
        
        const finalName = words.join('-') || `generated-${Date.now()}`;
        console.log('Final generated name:', finalName);
        
        return finalName;
      };

      // Store the current prompt value before resetting states
      const currentPrompt = promptValue;
      
      // If we have an original image, use its predefined prompt
      let namePrompt = currentPrompt;
      if (originalImage && FILE_IMPROVEMENTS[originalImage.id]) {
        namePrompt = FILE_IMPROVEMENTS[originalImage.id];
        console.log('Using predefined prompt from FILE_IMPROVEMENTS:', namePrompt);
      } else {
        console.log('No predefined prompt found for originalImage:', originalImage);
      }

      // Create a new file object for the generated image
      const newFile: File = {
        id: Date.now().toString(), // Use timestamp as a unique ID
        name: generateCustomName(namePrompt),
        extension: 'JPG',
        url: generatedImage,
        highResUrl: generatedImage, // Use the same URL for high-res since it's already high quality
        variantUrl: generatedImage // Add variantUrl
      }
      
      console.log('Created new file object:', newFile);
      
      // Add the new file to the beginning of the list
      setFiles((prevFiles) => {
        console.log('Previous files:', prevFiles);
        const newFiles = [newFile, ...prevFiles];
        console.log('Updated files list:', newFiles);
        return newFiles;
      });
      
      // Set the new file to be highlighted and selected
      setNewFilesToHighlight([newFile.id])
      setSelectedFiles([newFile.id])
      
      // Reset all states after creating the file
      setIsGenerateMode(false)
      setGeneratedImage(null)
      setPromptValue("")
      setIsLoading(false)
      setIsCollapsing(false)
      setIsPreviewMode(false)
      setIsFooterVisible(true)
      
      // Find the modal footer and add the fade-in class
      setTimeout(() => {
        const footer = document.querySelector('.Polaris-Modal-Dialog__Modal>.Polaris-InlineStack');
        if (footer) {
          footer.classList.remove('modal-footer-fade-out');
          footer.classList.add('modal-footer-fade-in');
        }
      }, 50);
    }
  }

  const handleGenerateVariation = (file: File) => {
    console.log('handleGenerateVariation called with file:', file);
    setFromVariant(true)
    setIsGenerateMode(true)
    setOriginalImage(file)
    console.log('Set originalImage to:', file);
    setPromptValue('') // Clear the prompt value
    setGeneratedImage(null)
    setIsLoading(false)
    setIsCollapsing(false)
    
    // Find the modal footer and add a class to it
    setTimeout(() => {
      const footer = document.querySelector('.Polaris-Modal-Dialog__Modal>.Polaris-InlineStack');
      if (footer) {
        footer.classList.remove('modal-footer-fade-in');
        footer.classList.add('modal-footer-fade-out');
      }
    }, 50);
    
    // Add a small delay to ensure the animation is visible
    setTimeout(() => {
      setIsGenerateMode(true)
    }, 300)
  }

  const handleDone = () => {
    console.log('handleDone called', {
      isGenerateMode,
      generatedImage,
      selectedFiles,
      files,
      originalImage,
      promptValue
    });

    if (isGenerateMode && generatedImage) {
      console.log('Handling generated image case');
      
      // Generate a custom name based on the prompt
      const generateCustomName = (prompt: string) => {
        console.log('generateCustomName called with prompt:', prompt);
        
        if (!prompt) {
          console.log('No prompt provided, returning default name');
          return 'generated-image';
        }
        
        // Clean up the prompt and create a meaningful name
        const cleanPrompt = prompt
          .toLowerCase()
          // Remove common words and articles
          .replace(/\b(make|add|create|enhance|give|the|a|an|and|or|but|in|on|at|to|for|with|by|it|more|very|much|so|such|as|like|than|that|this|these|those)\b/g, '')
          // Remove special characters
          .replace(/[^a-z0-9\s-]/g, '')
          .trim();
          
        console.log('After initial cleaning:', cleanPrompt);
        
        // Split into words and process
        const words = cleanPrompt.split(/\s+/)
          .filter(word => word.length > 2)
          .slice(0, 4);
          
        console.log('Processed words:', words);
        
        const finalName = words.join('-') || `generated-${Date.now()}`;
        console.log('Final generated name:', finalName);
        
        return finalName;
      };
      
      // Store the current prompt value before resetting states
      const currentPrompt = promptValue;
      
      // If we have an original image, use its predefined prompt
      let namePrompt = currentPrompt;
      if (originalImage && FILE_IMPROVEMENTS[originalImage.id]) {
        namePrompt = FILE_IMPROVEMENTS[originalImage.id];
        console.log('Using predefined prompt from FILE_IMPROVEMENTS:', namePrompt);
      } else {
        console.log('No predefined prompt found for originalImage:', originalImage);
      }
      
      // Create a new file object for the generated image
      const newFile: File = {
        id: Date.now().toString(), // Use timestamp as a unique ID
        name: generateCustomName(namePrompt),
        extension: 'JPG',
        url: generatedImage,
        highResUrl: generatedImage, // Use the same URL for high-res since it's already high quality
        variantUrl: generatedImage // Add variantUrl
      }
      
      console.log('Created new file:', newFile);
      
      // Add the new file to the beginning of the list
      setFiles((prevFiles) => {
        console.log('Updating files list, previous files:', prevFiles);
        return [newFile, ...prevFiles];
      });

      // Update selected files to include the new file
      setSelectedFiles([newFile.id]);
      
      // Select the newly created file
      console.log('Calling onFileSelect with new file');
      onFileSelect(newFile);
    } else if (selectedFiles.length > 0) {
      console.log('Handling selected files case');
      const selectedFile = files.find(file => file.id === selectedFiles[0]);
      console.log('Found selected file:', selectedFile);
      if (selectedFile) {
        console.log('Calling onFileSelect with selected file');
        onFileSelect(selectedFile);
      }
    } else {
      console.log('No action taken - no generated image or selected files');
    }
    
    // Reset footer visibility and generate mode before closing
    setIsFooterVisible(true);
    setIsGenerateMode(false);
    
    console.log('Calling onClose');
    onClose();
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
      setOriginalImage(null)
      setNewFilesToHighlight([])
    }
  }, [open])

  // Add a useEffect to handle the padding removal
  useEffect(() => {
    // Add a small delay to ensure DOM elements are available
    const timer = setTimeout(() => {
      const modalSection = document.querySelector('.Polaris-Modal-Section > section.Polaris-Box')
      if (modalSection) {
        const originalStyle = modalSection.getAttribute('style')
        
        // Force all padding values to 0 with !important to override any other values
        modalSection.setAttribute('style', `
          --pc-box-padding-block-start-xs: 0 !important; 
          --pc-box-padding-block-end-xs: 0 !important; 
          --pc-box-padding-inline-start-xs: 0 !important; 
          --pc-box-padding-inline-end-xs: 0 !important; 
          position: relative !important;
        `)
        
        modalSection.setAttribute('data-original-style', originalStyle || '')
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [isGenerateMode, open]) // Run when isGenerateMode or open changes

  // Handle arrow button hover
  const handleArrowHover = (isHovered: boolean) => {
    setIsArrowHovered(isHovered)
  }

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

  // Two button variants
  const GenerateImageButtonDefault = ({ onClick }: { onClick: () => void }) => (
    <div className="generate-image-button magic-button">
      <Button onClick={onClick} icon={ImageMagicIcon}>Generate image</Button>
    </div>
  )

  const GenerateImageButtonAnimated = ({ onClick }: { onClick: () => void }) => (
    <div
      className="generate-image-button"
      onClick={e => e.stopPropagation()}
      onMouseEnter={e => {
        // Find the closest DropZone ancestor
        const dropZone = (e.currentTarget as HTMLElement).closest('.Polaris-DropZone');
        if (dropZone) dropZone.classList.add('dropzone-animate');
        // Modal content overflow
        const modalContent = document.querySelector('.modal-content') as HTMLElement;
        if (modalContent) {
          modalContent.setAttribute('data-original-overflow', modalContent.style.overflow || '');
          modalContent.style.overflow = 'visible';
        }
        // File browser container overflow
        const fileBrowser = document.querySelector('.file-browser-container') as HTMLElement;
        if (fileBrowser) {
          fileBrowser.setAttribute('data-original-overflow', fileBrowser.style.overflow || '');
          fileBrowser.setAttribute('data-original-overflow-y', fileBrowser.style.overflowY || '');
          fileBrowser.style.overflow = 'visible';
          fileBrowser.style.overflowY = 'visible';
        }
      }}
      onMouseLeave={e => {
        const dropZone = (e.currentTarget as HTMLElement).closest('.Polaris-DropZone');
        const modalContent = document.querySelector('.modal-content') as HTMLElement;
        const fileBrowser = document.querySelector('.file-browser-container') as HTMLElement;

        if (dropZone) {
          dropZone.classList.add('dropzone-animate-fadeout');
          dropZone.classList.remove('dropzone-animate');
          // Remove fadeout class and restore overflow after transition
          const handleTransitionEnd = () => {
            dropZone.classList.remove('dropzone-animate-fadeout');
            dropZone.removeEventListener('transitionend', handleTransitionEnd);

            // Restore overflow properties here
            if (modalContent) {
              const original = modalContent.getAttribute('data-original-overflow');
              modalContent.style.overflow = original || 'hidden';
            }
            if (fileBrowser) {
              const original = fileBrowser.getAttribute('data-original-overflow');
              const originalY = fileBrowser.getAttribute('data-original-overflow-y');
              fileBrowser.style.overflow = original || '';
              fileBrowser.style.overflowY = originalY || '';
            }
          };
          dropZone.addEventListener('transitionend', handleTransitionEnd);
        } else {
          // Fallback: restore overflow immediately if dropZone not found
          if (modalContent) {
            const original = modalContent.getAttribute('data-original-overflow');
            modalContent.style.overflow = original || 'hidden';
          }
          if (fileBrowser) {
            const original = fileBrowser.getAttribute('data-original-overflow');
            const originalY = fileBrowser.getAttribute('data-original-overflow-y');
            fileBrowser.style.overflow = original || '';
            fileBrowser.style.overflowY = originalY || '';
          }
        }
      }}
    >
      <Button onClick={onClick} icon={ImageMagicIcon}>Generate image</Button>
    </div>
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
            <div className="generate-image-button magic-button" onClick={e => e.stopPropagation()}>
              <GenerateImageButtonDefault onClick={handleGenerateClick} />
            </div>
          </InlineStack>
          <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
            Drag and drop images, videos, 3D models, and files
          </Text>
        </BlockStack>
      </Box>
    </Box>
  )

  // Helper function to determine the generate mode container class
  const getGenerateModeContainerClass = () => {
    if (isCollapsing) {
      return 'collapsing';
    }
    
    // Initial state with no content
    if (!isLoading && !generatedImage && !originalImage && !fromVariant) {
      return 'animate-padding';
    }
    
    // State with content
    if (isLoading || generatedImage || originalImage) {
      return fromVariant ? 'with-content from-variant' : 'with-content';
    }
    
    // State without content but with variant
    if (fromVariant) {
      return 'from-variant';
    }
    
    // Default state
    return 'no-padding';
  };

  return (
    <div className={`custom-modal ${isGenerateMode ? 'generate-mode' : ''}`}>
      <Modal
        open={open}
        onClose={onClose}
        noScroll
        title={
          <div className={`modal-title ${isGenerateMode ? 'with-back-button' : ''}`}>
            <InlineStack align="center" gap="200">
              <Text as="span" variant="headingMd">
                {isGenerateMode ? (fromVariant ? "Generate variant" : "Generate image") : "Select files"}
              </Text>
            </InlineStack>
          </div>
        }
        size="large"
        primaryAction={{
          content: isGenerateMode ? 'Done' : 'Done',
          onAction: handleDone,
          disabled: isGenerateMode && (isLoading || !generatedImage),
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
            className={`modal-content ${isGenerateMode ? 'generate-mode-content' : ''} ${isGenerateMode ? (isFooterVisible ? 'footer-hidden' : 'footer-visible') : ''}`}
            style={{
              height: '661px',
              overflow: 'hidden',
              padding: '20px'
            }}
          >
            <div className={`action-bar-container ${isGenerateMode ? 'fade-out' : ''}`}>
                <Box paddingBlockEnd="400">
                  {actionBarMarkup}
                </Box>
            </div>
            
            {isGenerateMode && (
              <div className={`generate-mode-container ${getGenerateModeContainerClass()}`}>
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

                            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                              <InlineStack gap="300">
                                <Tooltip content="Report image">
                                  <div className="image-action-button">
                                    <Button
                                      icon={FlagIcon}
                                      variant="tertiary"
                                      size="medium"
                                    />
                                  </div>
                                </Tooltip>
                                <Tooltip content="Download">
                                  <div className="image-action-button">
                                    <Button
                                      icon={ImportIcon}
                                      variant="tertiary"
                                      size="medium"
                                    />
                                  </div>
                                </Tooltip>
                              </InlineStack>
                            </div>
                          </div>
                        </Box>
                      </div>
                    ) : originalImage ? (
                      <div className="original-image-container">
                        <Box>
                          <div style={{ position: 'relative' }}>
                            <img 
                              src={originalImage.highResUrl || originalImage.url} 
                              alt={originalImage.name} 
                              style={{ 
                                width: '100%', 
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                              }} 
                            />
                          </div>
                        </Box>
                      </div>
                    ) : null}

                    <div className="generate-mode-input">
                      <div className="faux-input">

                         
                          <InlineStack gap="200" wrap={false} blockAlign="center">

                              {isLoading ? (
                                <img src={sidekickAvatarThink} alt="Sidekick thinking" style={{ width: '24px', height: '24px' }} />
                              ) : (
                                <img src={currentAvatar} alt="Sidekick" style={{ width: '24px', height: '24px' }} />
                              )}

                            
                            <div onKeyDown={handleTabKeyPress} tabIndex={0} style={{ position: 'relative' }}>
                              <TextField
                                label="Prompt"
                                labelHidden
                                autoComplete="off"
                                placeholder={isGenerateMode ? (isLoading || generatedImage || fromVariant ? "" : "Describe your image") : "Describe your image"}
                                value={isLoading ? "" : (generatedImage ? "" : (fromVariant ? promptValue : promptValue))}
                                onChange={handlePromptChange}
                                disabled={isLoading}
                                onFocus={() => {
                                  if (isGenerateMode && !fromVariant && !promptValue) {
                                    setPromptValue("");
                                  }
                                }}
                              />


                              
                              {generatedImage && !isLoading && (
                                <div className="suggestion-indicator">
                                  <div className="suggestion-text">
                                    Ask a follow up
                                  </div>
                                </div>
                              )}
                              {!generatedImage && !isLoading && fromVariant && !promptValue && (
                                <div className="suggestion-indicator">
                                  <div className="suggestion-text">
                                    {FILE_IMPROVEMENTS[originalImage?.id || ''] || 'Press Tab for suggestion'}
                                  </div>
                                  <div className="tab-indicator">
                                   <img src={tabIcon} alt="Press Tab" />
                                </div>
                                </div>
                              )}
                              {isLoading && (
                                <div className="generating-indicator">
                                  <div className="generating-text">Generating image</div>
                                </div>
                              )}
                            </div>
                          </InlineStack>

                          
                            {isLoading ? (
                              <InlineStack>
                              <div className="stop-button-container">
                                <div 
                                  className="custom-stop-button"
                                  onClick={handleStopGeneration}
                                  role="button"
                                  tabIndex={0}
                                  aria-label="Stop generation"
                                >
                                  <span className="custom-stop-icon"></span>
                                </div>
                              </div>
                              </InlineStack>
                            ) : generatedImage ? (
                              <div className="generate-button-container overflow">

                                  
                                  <div className="discard-button-wrapper">
                                    <Button 
                                      size="slim" 
                                      onClick={() => {
                                        if (fromVariant) {
                                          // For variant generation, keep the original image and generate mode
                                          setGeneratedImage(null);
                                          setPromptValue("");
                                          setIsLoading(false);
                                          setIsCollapsing(false);
                                          setIsFooterVisible(false);
                                        } else {
                                          // For new image generation, return to empty generate screen
                                          setGeneratedImage(null);
                                          setPromptValue("");
                                          setIsLoading(false);
                                          setIsCollapsing(false);
                                          setOriginalImage(null);
                                          setFromVariant(false);
                                          setIsFooterVisible(false);
                                        }
                                      }}
                                      variant="secondary"
                                    >
                                      Discard
                                    </Button>
                                  </div>
                                  <div className="keep-button-wrapper">
                                  <Button 
                                      size="slim" 
                                       onClick={handleSaveToFiles}
                                      variant="primary"
                                      icon={UndoIcon}
                                    >
                                      Keep
                                    </Button>
                                  </div>

                              </div>
                            ) : (
                              <div className="generate-button-container">
                                <div className="arrow-up-button-wrapper">
                                <Button 
                                  size="slim" 
                                  onClick={handleGenerateButtonClick}
                                  icon={ArrowUpIcon}
                                  disabled={!promptValue.trim()}
                                  variant="tertiary"
                                />
                                </div>
                              </div>
                            )}

                        
                      </div>
                    </div>
                  </BlockStack>
                </Box>
              </div>
            )}
            
            <div className={`file-browser-container ${isGenerateMode ? 'fade-out' : ''}`}>
              <div className={`upload-actions-container ${isGenerateMode ? 'fade-out' : ''}`}>
                <Box paddingBlockEnd="400">
                    <DropZone onDrop={() => {}}>
                      {uploadActionsMarkup}
                    </DropZone>
                </Box>
              </div>
              
              <div 
                ref={fileGridRef}
                className={`file-grid-container ${isGenerateMode ? 'fade-out' : ''} ${isGridHovered ? 'arrow-hovered' : ''}`}
                style={{ 
                  transform: isGenerateMode 
                    ? 'translateY(390px)' 
                    : 'translateY(0px)', 
                  opacity: isGenerateMode 
                    ? (isGridHovered 
                        ? 0.4 
                        : 0.2)
                    : 1,
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
                }}
                onMouseEnter={() => setIsGridHovered(true)}
                onMouseLeave={() => setIsGridHovered(false)}
              >
                <Box>
                  <FileGrid 
                    files={files}
                    onFileSelect={handleFileSelect}
                    selectedFiles={selectedFiles}
                    onGenerateVariation={handleGenerateVariation}
                    newFilesToHighlight={newFilesToHighlight}
                  />
                </Box>
                
                {isGenerateMode && (
                  <div 
                    ref={dragHandleRef}
                    className={`file-grid-arrow-button`}
                    onClick={handleBackClick}
                  >
                    <Icon source={DragHandleIcon} />
                  </div>
                )}
              </div>
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
          onSaveToFiles={handleSaveToFiles}
        />
      )}
    </div>
  )
}
