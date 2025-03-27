
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileList } from '@/components/FileList';
import { FileUpload } from '@/components/FileUpload';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { 
  FileItem, 
  SortOptions, 
  FilterOptions,
} from '@/lib/types';
import { 
  filterFiles, 
  sortFiles, 
  generateMockFiles, 
  downloadFile, 
  deleteFile 
} from '@/lib/file-utils';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [showRecentFiles, setShowRecentFiles] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: 'date',
    direction: 'desc',
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchTerm: '',
  });
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch files on mount (mocked for demo)
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network
        const mockFiles = generateMockFiles(12);
        
        // Check if we have any uploaded files in session storage
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
        
        // Combine mock files with any uploaded files
        setFiles([...sessionFiles, ...mockFiles]);
      } catch (error) {
        toast.error('Failed to load files');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, []);
  
  // Filter and sort files when options or files change
  useEffect(() => {
    let result = [...files];
    
    // Filter
    result = filterFiles(result, filterOptions);
    
    // Sort
    result = sortFiles(result, sortOptions);
    
    setFilteredFiles(result);

    // Get recent files (last 5 files by date)
    const recentFilesList = [...files]
      .sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime())
      .slice(0, 5);
    
    setRecentFiles(recentFilesList);
  }, [files, sortOptions, filterOptions]);
  
  // Handle file download
  const handleDownload = async (file: FileItem) => {
    try {
      toast.loading(`Downloading ${file.name}...`);
      await downloadFile(file);
      toast.dismiss();
      toast.success(`Downloaded ${file.name}`);
    } catch (error) {
      toast.error('Download failed');
    }
  };
  
  // Handle file deletion
  const handleDelete = async (fileId: string) => {
    try {
      toast.loading('Deleting file...');
      await deleteFile(fileId);
      
      // Update local state after successful deletion
      setFiles(prev => prev.filter(file => file.id !== fileId));
      
      toast.dismiss();
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = (fileId: string, favorite: boolean) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, isFavorite: favorite } : file
      )
    );
    
    toast.success(favorite ? 'Added to favorites' : 'Removed from favorites');
  };
  
  // Handle viewing file details
  const handleViewDetails = (file: FileItem) => {
    navigate(`/file/${file.id}`);
  };
  
  // Handle file upload
  const handleUploadComplete = (
    file: File, 
    encrypted: boolean, 
    checksum?: string, 
    encryptionKey?: string
  ) => {
    // Create a new file item based on the uploaded file
    const newFile: FileItem = {
      // Ensure ID format matches the mock data format
      id: `file-${Date.now().toString()}`,
      name: file.name,
      type: file.name.split('.').pop() || '',
      size: file.size,
      path: `/files/${file.name}`,
      metadata: {
        name: file.name,
        type: file.name.split('.').pop() || '',
        size: file.size,
        createdAt: new Date(),
        modifiedAt: new Date(),
        createdBy: user?.name || 'Unknown',
        lastModifiedBy: user?.name || 'Unknown',
        encrypted: encrypted,
        checksum: checksum,
      },
      thumbnailUrl: undefined,
      isShared: false,
      sharedWith: [],
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
      },
      isFavorite: false,
      tags: [],
      isEncrypted: encrypted,
    };
    
    // Add the new file to the files list
    setFiles(prev => {
      const updatedFiles = [newFile, ...prev];
      
      // Store uploaded files in sessionStorage to persist between page navigations
      try {
        // Get existing uploaded files
        const sessionFilesStr = sessionStorage.getItem('uploadedFiles');
        let sessionFiles: FileItem[] = [];
        
        if (sessionFilesStr) {
          sessionFiles = JSON.parse(sessionFilesStr);
        }
        
        // Add the new file
        sessionFiles = [newFile, ...sessionFiles];
        
        // Store back in session storage
        sessionStorage.setItem('uploadedFiles', JSON.stringify(sessionFiles));
      } catch (e) {
        console.error("Error storing files in session storage:", e);
      }
      
      return updatedFiles;
    });
    
    // Close the upload dialog
    setShowUploadDialog(false);
  };
  
  // Handle sort change
  const handleSort = (options: SortOptions) => {
    setSortOptions(options);
  };
  
  // Handle filter change
  const handleFilter = (options: FilterOptions) => {
    setFilterOptions(options);
  };

  // Toggle recent files view
  const toggleRecentFiles = () => {
    setShowRecentFiles(prev => !prev);
    if (!showRecentFiles) {
      toast.info('Showing 5 most recently added files');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab="files" />
      
      <main className="flex-1 container max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Files</h1>
            <p className="text-muted-foreground mt-1">
              {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'} • Secure and encrypted
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={toggleRecentFiles}
              className={showRecentFiles ? "bg-secondary" : ""}
            >
              <Clock className="mr-2 h-4 w-4" />
              Recent Files
            </Button>
            <Button onClick={() => setShowUploadDialog(true)}>
              Upload File
            </Button>
          </div>
        </div>

        {showRecentFiles && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recently Added</h2>
              <Button variant="ghost" size="sm" onClick={toggleRecentFiles}>Hide</Button>
            </div>
            {recentFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentFiles.map(file => (
                  <div 
                    key={file.id} 
                    className="p-4 border rounded-lg bg-card hover:bg-card/80 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(file)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img 
                            src={file.thumbnailUrl || '/placeholder.svg'} 
                            alt={file.type} 
                            className="w-6 h-6"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Added {file.metadata.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent files found.</p>
            )}
          </div>
        )}
        
        <FileList
          files={filteredFiles}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={handleViewDetails}
          onSort={handleSort}
          onFilter={handleFilter}
          sortOptions={sortOptions}
          filterOptions={filterOptions}
          loading={loading}
        />
      </main>
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a new file to your secure vault
          </DialogDescription>
          
          <FileUpload onUploadComplete={handleUploadComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
