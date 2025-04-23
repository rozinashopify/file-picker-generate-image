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
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_make_the_necklace_more_elegant_with_a_golden_finish_011a9391-a92b-461c-9268-c19e33d135ea.webp?v=1745348766'
  },
  {
    id: '2',
    name: 'product-side',
    extension: 'PNG',
    url: 'https://burst.shopifycdn.com/photos/tucan-scarf_373x@2x.jpg',
    highResUrl: 'https://burst.shopifycdn.com/photos/tucan-scarf.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_add_a_warm_cozy_texture_to_the_scarf_1389f101-11f0-4973-9f20-c640803f6dfc.webp?v=1745349049'
  },
  {
    id: '3',
    name: 'lifestyle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/black-orange-stripes_373x@2x.jpg',
    highResUrl: 'https://burst.shopifycdn.com/photos/black-orange-stripes.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_enhance_the_contrast_of_the_stripes_ac52b25c-af3b-4616-80eb-36419b36cef0.webp?v=1745349328'
  },
  {
    id: '4',
    name: 'jewelry-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/anchor-bracelet-leather.jpg?width=150&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fanchor-bracelet-leather.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x',
    highResUrl: 'https://burst.shopifycdn.com/photos/anchor-bracelet-leather.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_add_a_vintage_filter_to_the_jewelry_collection_6d1c24b9-27c7-4bbe-8eb4-d94a10c88259.webp?v=1745349407'
  },
  {
    id: '5',
    name: 'watch-detail',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/a-close-up-of-luxury-watch.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fa-close-up-of-luxury-watch.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x',
    highResUrl: 'https://burst.shopifycdn.com/photos/a-close-up-of-luxury-watch.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_make_the_watch_face_more_luxurious_with_a_metallic_sh_78bc7283-249a-4749-bf63-2c8614b38a74.webp?v=1745349519'
  },
  {
    id: '6',
    name: 'sunglasses-lifestyle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/lined-black-sunglasses-on-a-pink-surface.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Flined-black-sunglasses-on-a-pink-surface.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/lined-black-sunglasses-on-a-pink-surface.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_add_a_summer_vibe_to_the_sunglasses_shot_3f793e8d-deb5-4e63-811a-3ee4a180f1d1.webp?v=1745349622'
  },
  {
    id: '7',
    name: 'handbag-product',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/gold-zipper-on-black-fashion-backpack.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fgold-zipper-on-black-fashion-backpack.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&crop=center&height=300',
    highResUrl: 'https://burst.shopifycdn.com/photos/gold-zipper-on-black-fashion-backpack.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_give_the_backpack_a_premium_leather_look_14e0d400-b093-4666-b055-a8e2ba9fe435.webp?v=1745349716'
  },
  {
    id: '8',
    name: 'shoes-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/footwear-close-up-man-tying-shoelace.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Ffootwear-close-up-man-tying-shoelace.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/footwear-close-up-man-tying-shoelace.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_add_a_lifestyle_context_to_the_shoes_4ff5b2e2-df59-4969-8776-c2905b20ba7f.webp?v=1745349871'
  },
  {
    id: '9',
    name: 'perfume-bottle',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/black-glass-perfume-bottle-and-spritzer.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fblack-glass-perfume-bottle-and-spritzer.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/black-glass-perfume-bottle-and-spritzer.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_create_a_luxurious_atmosphere_around_the_perfume_bott_e812cbfb-7d96-442f-b3e7-67a86ed352f6.webp?v=1745349988'
  },
  {
    id: '10',
    name: 'makeup-collection',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/bright-eyeshadow-makeup.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fbright-eyeshadow-makeup.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/bright-eyeshadow-makeup.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_enhance_the_makeup_colors_to_be_more_vibrant_7932e5e8-ac09-4f41-9f8c-cd34787585b9.webp?v=1745350084'
  },
  {
    id: '11',
    name: 'camera-equipment',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/camera-floating-on-grey-background.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fcamera-floating-on-grey-background.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/camera-floating-on-grey-background.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_add_a_professional_studio_lighting_effect_3a0e4b30-7a15-451b-a4bb-bbfa2d5a90d6.webp?v=1745350202'
  },
  {
    id: '12',
    name: 'coffee-shop',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/coffee-shop-stalker.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fcoffee-shop-stalker.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/coffee-shop-stalker.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_create_a_cozy_coffee_shop_atmosphere_49b4c725-9f68-4b3c-bee9-5191b4485642.webp?v=1745350375'
  },
  {
    id: '13',
    name: 'plant-arrangement',
    extension: 'JPG',
    url: 'https://burst.shopifycdn.com/photos/portrait-of-floral-arrangement-in-natural-light.jpg?width=300&format=pjpg&exif=0&iptc=0+1x%2C+https%3A%2F%2Fburst.shopifycdn.com%2Fphotos%2Fportrait-of-floral-arrangement-in-natural-light.jpg%3Fwidth%3D1850&format=pjpg&exif=0&iptc=0+2x&height=300&crop=center',
    highResUrl: 'https://burst.shopifycdn.com/photos/portrait-of-floral-arrangement-in-natural-light.jpg?width=1850&format=pjpg&exif=0&iptc=0',
    variantUrl: 'https://cdn.shopify.com/s/files/1/0661/1491/2508/files/zincsilla_add_a_soft_natural_glow_to_the_plant_arrangement_83222f6a-b104-41e0-abed-b1ba3f749423.webp?v=1745350470'
  }
]

interface FilePickerProps {
  open: boolean
  onClose: () => void
  onFileSelect: (file: File) => void
}

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
    if (event.key === 'Tab' && !promptValue && !isLoading) {
      event.preventDefault()
      if (originalImage) {
        setPromptValue(FILE_IMPROVEMENTS[originalImage.id] || 'make it more vibrant and colorful')
      } else if (generatedImage) {
        setPromptValue('add a magical glow to the leaves')
      } else {
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
  }

  const handleBackClick = () => {
    if (magicButtonRef.current) {
      magicButtonRef.current.classList.remove('expand')
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
    }, 300)
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
    
    // Simulate loading for 5 seconds then show the image
    setTimeout(() => {
      setIsLoading(false)
      setGeneratedImage('https://burst.shopifycdn.com/photos/closeup-of-clover-leaves.jpg?width=1850&format=pjpg&exif=0&iptc=0')
      setIsPostImageLoad(true)
    }, 7000)
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
      
      // Set the new file to be highlighted
      setNewFilesToHighlight([newFile.id])
      
      // Reset all states after creating the file
      setIsGenerateMode(false)
      setGeneratedImage(null)
      setPromptValue("")
      setIsLoading(false)
      setIsCollapsing(false)
      setIsPreviewMode(false)
    }
  }

  const handleGenerateVariation = (file: File) => {
    console.log('handleGenerateVariation called with file:', file);
    setFromVariant(true)
    setIsGenerateMode(true)
    setOriginalImage(file)
    console.log('Set originalImage to:', file);
    setPromptValue('')
    setGeneratedImage(null)
    setIsLoading(false)
    setIsCollapsing(false)
    
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

  // Add a useEffect to handle the padding removal when in generate mode
  useEffect(() => {
    if (isGenerateMode) {
      const modalSection = document.querySelector('.Polaris-Modal-Section > section.Polaris-Box')
      if (modalSection) {
        const originalStyle = modalSection.getAttribute('style')
        modalSection.setAttribute('style', '--pc-box-padding-block-start-xs: 0 !important; --pc-box-padding-block-end-xs: 0 !important; --pc-box-padding-inline-start-xs: 0 !important; --pc-box-padding-inline-end-xs: 0 !important; position: relative !important;')
        modalSection.setAttribute('data-original-style', originalStyle || '')
      }
    } else {
      const modalSection = document.querySelector('.Polaris-Modal-Section > section.Polaris-Box')
      if (modalSection) {
        const originalStyle = modalSection.getAttribute('data-original-style')
        if (originalStyle) {
          modalSection.setAttribute('style', originalStyle)
        }
      }
    }
  }, [isGenerateMode])

  // Handle arrow button hover
  const handleArrowMouseEnter = () => {
    setIsArrowHovered(true)
  }

  const handleArrowMouseLeave = () => {
    setIsArrowHovered(false)
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

  const uploadActionsMarkup = (
    <Box paddingBlock="800">
      <Box>
        <BlockStack gap="100">
          <InlineStack align="center" blockAlign="center" gap="400">
            <ButtonGroup variant="segmented">
              <Button>Upload files</Button>
              <Button icon={ChevronDownIcon} accessibilityLabel="Create folder" />
            </ButtonGroup>
            <div className="generate-image-button" onClick={(e) => e.stopPropagation()}>
              <Button onClick={handleGenerateClick} icon={ImageMagicIcon}>Generate image</Button>
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
    <div className={`custom-modal ${isGenerateMode ? 'generate-mode' : ''}`}>
      <Modal
        open={open}
        onClose={onClose}
        noScroll
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
            className={`modal-content ${isGenerateMode ? 'generate-mode-content' : ''}`}
            style={{
              height: '600px',
              maxHeight: '70vh',
              overflow: 'auto',
              ...(isGenerateMode && {
                overflow: 'hidden',
                padding: '20px'
              })
            }}
          >
            <div className={`action-bar-container ${isGenerateMode ? 'fade-out' : ''}`}>
              {!isGenerateMode && (
                <Box paddingBlockEnd="400">
                  {actionBarMarkup}
                </Box>
              )}
            </div>
            
            {isGenerateMode && (
              <div className={`generate-mode-container ${
                !isLoading && !generatedImage && !originalImage && !fromVariant
                  ? 'animate-padding'
                  : isLoading || generatedImage || originalImage
                    ? fromVariant
                      ? 'with-content from-variant'
                      : 'with-content'
                    : fromVariant
                      ? 'from-variant'
                      : 'no-padding'
              }`}>
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

                            <div style={{ position: 'absolute', bottom: '16px', right: '12px' }}>

                                <div className="image-save-button">
                                  <Button
                                    onClick={handleSaveToFiles}
                                    variant="secondary"
                                    size="micro"
                                  >
                                    Save to files
                                  </Button>
                                </div>

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
                        <InlineStack wrap={false} blockAlign="center" align="space-between">
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
                                placeholder=""
                                value={isLoading ? "" : (generatedImage ? "" : promptValue)}
                                onChange={handlePromptChange}
                                disabled={isLoading}
                              />
                              {(!promptValue || generatedImage) && !isLoading && (
                                <div className="suggestion-indicator">
                                  <div className="suggestion-text">
                                    {originalImage 
                                      ? FILE_IMPROVEMENTS[originalImage.id] || 'make it more vibrant and colorful'
                                      : generatedImage 
                                        ? 'add a magical glow to the leaves'
                                        : 'lush green leaves'
                                    }
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

                          <Box>
                            {isLoading ? (
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
                            ) : generatedImage ? (
                              <div className="generate-button-container">
                                <Button 
                                  size="slim" 
                                  onClick={handleTryAgain}
                                  icon={ArrowUpIcon}
                                  variant="tertiary"
                                />
                              </div>
                            ) : (
                              <div className="generate-button-container">
                                <Button 
                                  size="slim" 
                                  onClick={handleGenerateButtonClick}
                                  icon={ArrowUpIcon}
                                  disabled={!promptValue.trim()}
                                  variant="tertiary"
                                />
                              </div>
                            )}
                          </Box>
                        </InlineStack>
                      </div>
                    </div>
                  </BlockStack>
                </Box>
              </div>
            )}
            
            <div className={`file-browser-container ${isGenerateMode ? 'fade-out' : ''} ${isArrowHovered ? 'arrow-hovered' : ''}`}>
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
                  <FileGrid 
                    files={files}
                    onFileSelect={handleFileSelect}
                    selectedFiles={selectedFiles}
                    onGenerateVariation={handleGenerateVariation}
                    newFilesToHighlight={newFilesToHighlight}
                  />
                </Box>
              </div>
              
              {isGenerateMode && (
                <div 
                  className="file-grid-arrow-button"
                  onMouseEnter={handleArrowMouseEnter}
                  onMouseLeave={handleArrowMouseLeave}
                >
                  <Icon source={ArrowUpIcon} />
                </div>
              )}
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
