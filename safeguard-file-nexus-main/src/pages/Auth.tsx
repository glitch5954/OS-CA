
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

const Auth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <div className="w-full max-w-md">
        <AuthForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This is a demo application. Use these credentials:
          </p>
          <div className="mt-2 text-xs bg-muted p-2 rounded-md inline-block">
            <div><strong>Email:</strong> demo@example.com</div>
            <div><strong>Password:</strong> password</div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-xs text-center text-muted-foreground">
        <p>SecureVault &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Secure File Management System</p>
      </footer>
    </div>
  );
};

export default Auth;
