
import React, { useState, useRef } from 'react';
import { UploadCloud, X, FileText, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { encryptFile, generateChecksum } from '@/lib/encryption';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadComplete: (file: File, encrypted: boolean, checksum?: string, encryptionKey?: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [encrypt, setEncrypt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      setUploadProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // For demo, add a small delay to show completed upload
        setTimeout(() => {
          setUploading(false);
          toast.success("File uploaded successfully");
        }, 500);
      }
    }, 200);
    
    return interval;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Start the upload simulation
      const progressInterval = simulateUploadProgress();
      
      let checksum: string | undefined;
      let encryptionKey: string | undefined;
      
      // If encryption is enabled, encrypt the file
      if (encrypt) {
        const { key } = await encryptFile(selectedFile);
        encryptionKey = key;
        toast.info("File encrypted successfully");
      }
      
      // Generate a checksum
      checksum = await generateChecksum(selectedFile);
      
      // Complete the upload
      onUploadComplete(selectedFile, encrypt, checksum, encryptionKey);
      
      // Clear the selected file after upload
      setTimeout(() => {
        clearSelectedFile();
        clearInterval(progressInterval);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-secondary/40'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-1">Upload File</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <Button variant="outline" size="sm" className="mx-auto">
            Browse Files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <FileText className="h-10 w-10 text-primary mr-3" />
              <div>
                <h3 className="font-medium text-sm truncate max-w-[200px]">
                  {selectedFile.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            {!uploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSelectedFile}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {uploading && (
            <div className="my-4">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2 my-4">
            <Switch
              id="encryption"
              checked={encrypt}
              onCheckedChange={setEncrypt}
              disabled={uploading}
            />
            <Label htmlFor="encryption" className="text-sm cursor-pointer flex items-center gap-1">
              Encrypt file
              {encrypt && <Check className="h-3 w-3 text-green-500" />}
            </Label>
          </div>
          
          <div className="flex gap-2 justify-end">
            {!uploading && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelectedFile}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-24"
                >
                  Upload
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
