import React from 'react';

const AuthBackground = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-muted/30 to-accent/5">
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        
        {/* Medium Circle */}
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-2xl"></div>
        
        {/* Small Circles */}
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
      </div>

      {/* Tech-inspired Lines */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path
            d="M0,200 Q250,150 500,200 T1000,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/30"
          />
          <path
            d="M0,400 Q250,350 500,400 T1000,400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-accent/30"
          />
          <path
            d="M0,600 Q250,550 500,600 T1000,600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-secondary/30"
          />
        </svg>
      </div>

      {/* Mobile Optimized Background */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-b from-background to-muted/50"></div>
    </div>
  );
};

export default AuthBackground;