
import React, { useState } from 'react';
import { FileItem, SortOptions, ViewMode, FilterOptions } from '@/lib/types';
import { FileCard } from './FileCard';
import { 
  Search, 
  Filter, 
  X, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List, 
  AlertCircle,
  FileIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { shareFile } from '@/lib/file-utils';
import { ShareModal } from './ShareModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileListProps {
  files: FileItem[];
  onDownload: (file: FileItem) => void;
  onDelete: (fileId: string) => void;
  onToggleFavorite: (fileId: string, favorite: boolean) => void;
  onViewDetails: (file: FileItem) => void;
  onSort: (options: SortOptions) => void;
  onFilter: (options: FilterOptions) => void;
  sortOptions: SortOptions;
  filterOptions: FilterOptions;
  loading: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onDownload,
  onDelete,
  onToggleFavorite,
  onViewDetails,
  onSort,
  onFilter,
  sortOptions,
  filterOptions,
  loading,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState(filterOptions.searchTerm || '');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter({ ...filterOptions, searchTerm: value });
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    onFilter({ ...filterOptions, searchTerm: '' });
  };
  
  const handleToggleView = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  const toggleSortDirection = () => {
    onSort({
      ...sortOptions,
      direction: sortOptions.direction === 'asc' ? 'desc' : 'asc',
    });
  };
  
  const handleSortChange = (value: string) => {
    onSort({
      ...sortOptions,
      sortBy: value as SortOptions['sortBy'],
    });
  };
  
  const openShareModal = (file: FileItem) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };
  
  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedFile(null);
  };
  
  const handleShare = async (email: string, permissions: any) => {
    if (selectedFile) {
      await shareFile(selectedFile.id, email, permissions);
      closeShareModal();
    }
  };
  
  const confirmDelete = (fileId: string) => {
    setFileToDelete(fileId);
  };
  
  const handleConfirmDelete = () => {
    if (fileToDelete) {
      onDelete(fileToDelete);
      setFileToDelete(null);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 w-full"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Files</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Filter options would go here */}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortOptions.sortBy} onValueChange={handleSortChange}>
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="type">Type</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start font-normal" 
                onClick={toggleSortDirection}
              >
                {sortOptions.direction === 'asc' ? (
                  <><SortAsc className="mr-2 h-4 w-4" /> Ascending</>
                ) : (
                  <><SortDesc className="mr-2 h-4 w-4" /> Descending</>
                )}
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleToggleView}>
            {viewMode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="h-40 rounded-lg bg-muted/50"
            />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No files found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm ? "Try a different search term or clear your filters." : "Upload your first file to get started."}
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-2"
        }>
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={onDownload}
              onDelete={confirmDelete}
              onOpenShareModal={openShareModal}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
      
      {/* Share Modal */}
      {showShareModal && selectedFile && (
        <ShareModal
          file={selectedFile}
          onShare={handleShare}
          onClose={closeShareModal}
        />
      )}
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent className="max-w-md animate-in fade-in">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
