
import React, { useState } from 'react';
import { FileItem, FileShare } from '@/lib/types';
import { 
  X, 
  Users, 
  Mail, 
  Check, 
  Trash2, 
  Edit2, 
  Download,
  Share2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ShareModalProps {
  file: FileItem;
  onShare: (email: string, permissions: { canView: boolean; canEdit: boolean; canDelete: boolean; canShare: boolean }) => Promise<void>;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ file, onShare, onClose }) => {
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState({
    canView: true,
    canEdit: false,
    canDelete: false,
    canShare: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onShare(email, permissions);
      toast.success(`File shared with ${email}`);
      setEmail('');
    } catch (error) {
      toast.error('Failed to share file. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCopyLink = () => {
    // Generate a mock shareable link
    const shareableLink = `https://securevault.app/share/${file.id}?token=${Math.random().toString(36).substring(2, 15)}`;
    
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setIsLinkCopied(true);
        toast.success('Link copied to clipboard');
        
        setTimeout(() => {
          setIsLinkCopied(false);
        }, 3000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg animate-in fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Share "{file.name}"
          </DialogTitle>
          <DialogDescription>
            Share this file with others and set access permissions
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full flex justify-between items-center group"
              onClick={handleCopyLink}
            >
              <span className="truncate mr-2">
                {isLinkCopied ? 'Link copied!' : 'Copy shareable link'}
              </span>
              {isLinkCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Share2 className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              )}
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 items-end">
                <div className="col-span-3">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="colleague@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Button type="submit" className="col-span-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Sharing...' : 'Share'}
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Permissions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="view"
                      checked={permissions.canView}
                      onCheckedChange={(checked) => 
                        setPermissions({ ...permissions, canView: checked as boolean })
                      }
                      disabled
                    />
                    <Label htmlFor="view" className="text-sm cursor-pointer">
                      View
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit"
                      checked={permissions.canEdit}
                      onCheckedChange={(checked) => 
                        setPermissions({ ...permissions, canEdit: checked as boolean })
                      }
                    />
                    <Label htmlFor="edit" className="text-sm cursor-pointer">
                      Edit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="delete"
                      checked={permissions.canDelete}
                      onCheckedChange={(checked) => 
                        setPermissions({ ...permissions, canDelete: checked as boolean })
                      }
                    />
                    <Label htmlFor="delete" className="text-sm cursor-pointer">
                      Delete
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="share"
                      checked={permissions.canShare}
                      onCheckedChange={(checked) => 
                        setPermissions({ ...permissions, canShare: checked as boolean })
                      }
                    />
                    <Label htmlFor="share" className="text-sm cursor-pointer">
                      Share
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </form>
          
          {file.sharedWith.length > 0 && (
            <>
              <Separator className="my-4" />
              
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Already shared with
                </h4>
                <ul className="space-y-2">
                  {file.sharedWith.map((share) => (
                    <li
                      key={share.id}
                      className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{share.userName}</p>
                          <p className="text-xs text-muted-foreground">{share.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
