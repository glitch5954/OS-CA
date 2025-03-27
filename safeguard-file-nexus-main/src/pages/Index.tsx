
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Shield, FileText, Lock, Share2, Layers, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Secure File Storage",
      description: "Safely store all your important documents with enterprise-grade security"
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Advanced Encryption",
      description: "Files are encrypted both in transit and at rest for maximum protection"
    },
    {
      icon: <Share2 className="h-8 w-8 text-primary" />,
      title: "Controlled Sharing",
      description: "Share files with granular permission controls and expiration dates"
    },
    {
      icon: <Layers className="h-8 w-8 text-primary" />,
      title: "File Versioning",
      description: "Keep track of changes with automatic version history"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      {/* Header */}
      <header className="w-full backdrop-blur-md bg-white/70 dark:bg-black/50 shadow-sm border-b border-gray-200 dark:border-gray-800 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold tracking-tight">SecureVault</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Secure. Private. Reliable.
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Secure File Management System
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Protect your sensitive files with enterprise-grade security while maintaining seamless access and sharing capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Button size="lg" className="group" onClick={() => navigate('/auth')}>
                Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}>
                {isAuthenticated ? 'Go to Dashboard' : 'Learn More'}
              </Button>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow flex flex-col items-center text-center animate-in fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 mb-4 rounded-full bg-primary/10">{feature.icon}</div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Security Feature Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">
                Industry-Leading Security Standards
              </h2>
              <p className="text-muted-foreground">
                Our secure file management system is built with multiple layers of protection to keep your data safe from unauthorized access and security threats.
              </p>
              <ul className="space-y-3">
                {[
                  "End-to-end encryption for all files",
                  "Two-factor authentication support",
                  "Access control with granular permissions",
                  "Automated threat detection and prevention",
                  "Regular security audits and compliance checks"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Shield className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}>
                {isAuthenticated ? 'Go to Dashboard' : 'Start Secure File Management'}
              </Button>
            </div>
            <div className="md:w-1/2 border rounded-xl p-1 animate-in slide-up">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="h-24 w-24 text-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium">SecureVault</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} SecureVault. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
