
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface FilePermission {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export interface FileShare {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  permissions: FilePermission;
  createdAt: Date;
}

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  encrypted: boolean;
  checksum?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  metadata: FileMetadata;
  thumbnailUrl?: string;
  isShared: boolean;
  sharedWith: FileShare[];
  permissions: FilePermission;
  isFavorite: boolean;
  tags: string[];
  parentFolderId?: string;
  isEncrypted: boolean;
}

export type SortOption = 'name' | 'size' | 'date' | 'type';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export interface FilterOptions {
  searchTerm?: string;
  fileTypes?: string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  tags?: string[];
  onlyFavorites?: boolean;
  onlyShared?: boolean;
  onlyEncrypted?: boolean;
}

export interface SortOptions {
  sortBy: SortOption;
  direction: SortDirection;
}
