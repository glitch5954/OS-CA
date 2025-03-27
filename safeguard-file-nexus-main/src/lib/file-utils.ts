
import { FileItem, FileMetadata, FilterOptions, SortOptions } from './types';
import { formatDistanceToNow } from 'date-fns';

// Mock file data generator
export const generateMockFiles = (count = 10): FileItem[] => {
  const fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'txt', 'zip'];
  const fileSizes = [
    100 * 1024, // 100 KB
    1.5 * 1024 * 1024, // 1.5 MB
    3 * 1024 * 1024, // 3 MB
    10 * 1024 * 1024, // 10 MB
    25 * 1024 * 1024, // 25 MB
  ];
  
  const files: FileItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const size = fileSizes[Math.floor(Math.random() * fileSizes.length)];
    const isEncrypted = Math.random() > 0.7;
    const isShared = Math.random() > 0.8;
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    files.push({
      id: `file-${i}`,
      name: `File-${i}.${type}`,
      type,
      size,
      path: `/files/file-${i}.${type}`,
      metadata: {
        name: `File-${i}.${type}`,
        type,
        size,
        createdAt: createdDate,
        modifiedAt: new Date(),
        createdBy: 'Demo User',
        lastModifiedBy: 'Demo User',
        encrypted: isEncrypted,
        checksum: isEncrypted ? generateRandomChecksum() : undefined,
      },
      thumbnailUrl: getThumbnailForType(type),
      isShared,
      sharedWith: isShared ? generateMockShares() : [],
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
      },
      isFavorite: Math.random() > 0.8,
      tags: generateRandomTags(),
      isEncrypted,
    });
  }
  
  return files;
};

// Filter files based on provided options
export const filterFiles = (files: FileItem[], options: FilterOptions): FileItem[] => {
  return files.filter(file => {
    // Filter by search term
    if (options.searchTerm && !file.name.toLowerCase().includes(options.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by file types
    if (options.fileTypes && options.fileTypes.length > 0 && !options.fileTypes.includes(file.type)) {
      return false;
    }
    
    // Filter by date range
    if (options.dateRange) {
      const { from, to } = options.dateRange;
      if (from && file.metadata.createdAt < from) return false;
      if (to && file.metadata.createdAt > to) return false;
    }
    
    // Filter by tags
    if (options.tags && options.tags.length > 0 && !options.tags.some(tag => file.tags.includes(tag))) {
      return false;
    }
    
    // Filter by favorites
    if (options.onlyFavorites && !file.isFavorite) return false;
    
    // Filter by shared files
    if (options.onlyShared && !file.isShared) return false;
    
    // Filter by encrypted files
    if (options.onlyEncrypted && !file.isEncrypted) return false;
    
    return true;
  });
};

// Sort files based on provided options
export const sortFiles = (files: FileItem[], options: SortOptions): FileItem[] => {
  return [...files].sort((a, b) => {
    let comparison = 0;
    
    switch (options.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'date':
        comparison = a.metadata.modifiedAt.getTime() - b.metadata.modifiedAt.getTime();
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }
    
    return options.direction === 'asc' ? comparison : -comparison;
  });
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date for display
export const formatDate = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

// Get thumbnail URL based on file type
export const getThumbnailForType = (type: string): string => {
  switch (type) {
    case 'pdf':
      return '/placeholder.svg'; // Replace with actual icons in production
    case 'docx':
      return '/placeholder.svg';
    case 'xlsx':
      return '/placeholder.svg';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return '/placeholder.svg';
    case 'zip':
      return '/placeholder.svg';
    default:
      return '/placeholder.svg';
  }
};

// Generate a random checksum for demo purposes
const generateRandomChecksum = (): string => {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate random tags for demo
const generateRandomTags = (): string[] => {
  const allTags = ['important', 'work', 'personal', 'tax', 'project', 'archive', 'backup'];
  const count = Math.floor(Math.random() * 3);
  const tags: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }
  
  return tags;
};

// Generate mock shares for demo purposes
const generateMockShares = () => {
  const count = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: count }, (_, i) => ({
    id: `share-${i}`,
    userId: `user-${i + 2}`,
    userName: `User ${i + 2}`,
    userEmail: `user${i+2}@example.com`,
    permissions: {
      canView: true,
      canEdit: Math.random() > 0.5,
      canDelete: Math.random() > 0.8,
      canShare: Math.random() > 0.7,
    },
    createdAt: new Date(),
  }));
};

// Download file (simulated for demo)
export const downloadFile = (file: FileItem): Promise<void> => {
  return new Promise((resolve, reject) => {
    // In a real app, this would initiate the download
    console.log(`Downloading file: ${file.name}`);
    
    // Simulate download process
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

// Delete file (simulated for demo)
export const deleteFile = (fileId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // In a real app, this would delete the file
    console.log(`Deleting file with ID: ${fileId}`);
    
    // Simulate delete process
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

// Share file (simulated for demo)
export const shareFile = (
  fileId: string, 
  email: string, 
  permissions: { canView: boolean; canEdit: boolean; canDelete: boolean; canShare: boolean; }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // In a real app, this would share the file
    console.log(`Sharing file ${fileId} with ${email}`);
    
    // Simulate share process
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};
