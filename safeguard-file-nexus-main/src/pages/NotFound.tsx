
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <FileQuestion className="h-20 w-20 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
      
      <footer className="mt-12 text-xs text-center text-muted-foreground">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-4 w-4 mr-1 text-primary" />
          <span>SecureVault</span>
        </div>
        <p>Secure File Management System</p>
      </footer>
    </div>
  );
};

export default NotFound;
