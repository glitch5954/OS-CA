
import React from 'react';
import { FileItem } from '@/lib/types';
import { formatFileSize, formatDate } from '@/lib/file-utils';
import {
  MoreHorizontal,
  Download,
  Trash2,
  Share2,
  Heart,
  FileText,
  FileImage,
  FileSpreadsheet,
  FilePlus,
  File,
  Lock,
  Star,
  StarOff
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FileCardProps {
  file: FileItem;
  onDownload: (file: FileItem) => void;
  onDelete: (fileId: string) => void;
  onOpenShareModal: (file: FileItem) => void;
  onToggleFavorite: (fileId: string, favorite: boolean) => void;
  onViewDetails: (file: FileItem) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  onDownload,
  onDelete,
  onOpenShareModal,
  onToggleFavorite,
  onViewDetails,
}) => {
  // Determine file icon based on type
  const getFileIcon = () => {
    switch (file.type) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'docx':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImage className="h-10 w-10 text-purple-500" />;
      case 'zip':
        return <FilePlus className="h-10 w-10 text-yellow-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <Card 
      className={cn(
        "group h-full file-card flex flex-col justify-between hover:scale-[1.02] cursor-pointer",
        file.isEncrypted ? "bg-black/[0.01] dark:bg-white/[0.01] border border-primary/30" : ""
      )}
      onClick={() => onViewDetails(file)}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            {getFileIcon()}
            <div className="overflow-hidden">
              <h3 className="font-medium text-sm truncate">{file.name}</h3>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {file.isEncrypted && (
              <Lock className="h-4 w-4 text-primary shrink-0" />
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 animate-in fade-in-80 slide-in-from-top-5">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onDownload(file);
                }}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onOpenShareModal(file);
                }}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(file.id, !file.isFavorite);
                }}>
                  {file.isFavorite ? (
                    <>
                      <StarOff className="mr-2 h-4 w-4" />
                      <span>Remove Favorite</span>
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      <span>Add to Favorites</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.id);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap gap-1">
            {file.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] h-4 px-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(file.metadata.modifiedAt)}</span>
        
        <div className="flex items-center space-x-1">
          {file.isShared && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1">
              Shared
            </Badge>
          )}
          {file.isFavorite && (
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
