
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { FileItem } from '@/lib/types';
import { generateMockFiles, formatFileSize, formatDate, downloadFile, shareFile } from '@/lib/file-utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShareModal } from '@/components/ShareModal';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Download,
  Share2,
  Trash2,
  FileText,
  FilePlus,
  FileImage,
  FileSpreadsheet,
  File,
  Lock,
  Shield,
  Key,
  Users,
  Clock,
  Star,
  StarOff,
  ClipboardCopy,
  CheckCircle2,
} from 'lucide-react';

const FileDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [checksumCopied, setChecksumCopied] = useState(false);
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch file details
  useEffect(() => {
    const fetchFileDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
        
        // For demo, generate mock files and find the one with matching ID
        const mockFiles = generateMockFiles(20);
        
        // Check sessionStorage for recently uploaded files
        const sessionFilesStr = sessionStorage.getItem('uploadedFiles');
        let sessionFiles: FileItem[] = [];
        if (sessionFilesStr) {
          try {
            // Parse dates properly from session storage
            const parsedFiles = JSON.parse(sessionFilesStr);
            sessionFiles = parsedFiles.map((file: any) => ({
              ...file,
              metadata: {
                ...file.metadata,
                createdAt: new Date(file.metadata.createdAt),
                modifiedAt: new Date(file.metadata.modifiedAt)
              }
            }));
          } catch (e) {
            console.error("Error parsing session files:", e);
          }
        }
        
        // Combine mock files with session files
        const allFiles = [...mockFiles, ...sessionFiles];
        
        // Find the file with matching ID
        const foundFile = allFiles.find(file => file.id === id);
        
        if (foundFile) {
          setFile(foundFile);
        } else {
          toast.error('File not found');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load file details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFileDetails();
  }, [id, navigate]);
  
  // Handle file download
  const handleDownload = async () => {
    if (!file) return;
    
    try {
      toast.loading(`Downloading ${file.name}...`);
      await downloadFile(file);
      toast.dismiss();
      toast.success(`Downloaded ${file.name}`);
    } catch (error) {
      toast.error('Download failed');
    }
  };
  
  // Handle file delete
  const handleDelete = async () => {
    if (!file) return;
    
    try {
      toast.loading('Deleting file...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network
      toast.dismiss();
      toast.success('File deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };
  
  // Handle share
  const handleShare = async (email: string, permissions: any) => {
    if (!file) return;
    
    try {
      await shareFile(file.id, email, permissions);
      toast.success(`File shared with ${email}`);
      setShowShareModal(false);
      
      // Update file with new share info
      setFile(prev => {
        if (!prev) return prev;
        
        const newShare = {
          id: `share-${Date.now()}`,
          userId: `user-${Date.now()}`,
          userName: email.split('@')[0],
          userEmail: email,
          permissions,
          createdAt: new Date(),
        };
        
        return {
          ...prev,
          isShared: true,
          sharedWith: [...prev.sharedWith, newShare],
        };
      });
    } catch (error) {
      toast.error('Failed to share file');
    }
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = () => {
    if (!file) return;
    
    setFile(prev => {
      if (!prev) return prev;
      return { ...prev, isFavorite: !prev.isFavorite };
    });
    
    toast.success(file.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };
  
  // Copy checksum to clipboard
  const copyChecksum = () => {
    if (!file?.metadata.checksum) return;
    
    navigator.clipboard.writeText(file.metadata.checksum);
    setChecksumCopied(true);
    toast.success('Checksum copied to clipboard');
    
    setTimeout(() => {
      setChecksumCopied(false);
    }, 3000);
  };
  
  // Get file icon based on type
  const getFileIcon = () => {
    if (!file) return <File className="h-12 w-12 text-gray-500" />;
    
    switch (file.type) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-500" />;
      case 'docx':
        return <FileText className="h-12 w-12 text-blue-500" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-12 w-12 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImage className="h-12 w-12 text-purple-500" />;
      case 'zip':
        return <FilePlus className="h-12 w-12 text-yellow-500" />;
      default:
        return <File className="h-12 w-12 text-gray-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeTab="files" />
        <div className="container max-w-4xl mx-auto p-4 md:p-6">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted/50 rounded mb-4"></div>
            <div className="h-32 bg-muted/30 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-12 bg-muted/40 rounded"></div>
              <div className="h-12 bg-muted/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!file) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeTab="files" />
        <div className="container max-w-4xl mx-auto p-4 md:p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">File Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The file you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Files
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="files" />
      
      <main className="container max-w-4xl mx-auto p-4 md:p-6">
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate('/dashboard')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Files
        </Button>
        
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 bg-muted/30 rounded-lg p-6 flex items-center justify-center">
              {getFileIcon()}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h1 className="text-2xl font-bold break-all">{file.name}</h1>
                  <p className="text-muted-foreground">
                    {formatFileSize(file.size)} • {file.type.toUpperCase()}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleFavorite}
                  >
                    {file.isFavorite ? (
                      <>
                        <StarOff className="mr-2 h-4 w-4" />
                        Unfavorite
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 h-4 w-4" />
                        Favorite
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {file.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
                {file.isEncrypted && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Lock className="mr-1 h-3 w-3" />
                    Encrypted
                  </Badge>
                )}
                {file.isShared && (
                  <Badge variant="secondary">
                    <Users className="mr-1 h-3 w-3" />
                    Shared
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Created
              </h3>
              <p>{formatDate(file.metadata.createdAt)} by {file.metadata.createdBy}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Last Modified
              </h3>
              <p>{formatDate(file.metadata.modifiedAt)} by {file.metadata.lastModifiedBy}</p>
            </div>
            
            {file.isEncrypted && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                    Encryption Status
                  </h3>
                  <p className="flex items-center text-green-600 dark:text-green-500">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Encrypted with AES-256
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                    Security Checksum
                  </h3>
                  <div className="flex items-center">
                    <code className="text-xs bg-muted p-1 rounded truncate max-w-[170px] inline-block">
                      {file.metadata.checksum || 'Not available'}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={copyChecksum}
                      disabled={!file.metadata.checksum}
                    >
                      {checksumCopied ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <ClipboardCopy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {file.sharedWith.length > 0 && (
            <>
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                  Shared With ({file.sharedWith.length})
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {file.sharedWith.map((share) => (
                    <div
                      key={share.id}
                      className="p-3 rounded-md border bg-card"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{share.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {share.userEmail}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(share.createdAt)}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {share.permissions.canView && (
                          <Badge variant="outline" className="text-[10px]">View</Badge>
                        )}
                        {share.permissions.canEdit && (
                          <Badge variant="outline" className="text-[10px]">Edit</Badge>
                        )}
                        {share.permissions.canDelete && (
                          <Badge variant="outline" className="text-[10px]">Delete</Badge>
                        )}
                        {share.permissions.canShare && (
                          <Badge variant="outline" className="text-[10px]">Share</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      {showShareModal && (
        <ShareModal
          file={file}
          onShare={handleShare}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default FileDetails;
