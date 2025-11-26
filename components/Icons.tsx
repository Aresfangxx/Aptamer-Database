import React from 'react';

export const StemLoopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Stem */}
    <path d="M60 400 V250 Q60 200 100 200 Q140 200 140 250 V400" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Internal Loops/Bulges */}
    <path d="M60 300 H140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    <path d="M60 320 H140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    <path d="M60 340 H140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    
    {/* Upper Hairpin */}
    <path d="M80 200 V150 Q80 100 100 100 Q120 100 120 150 V200" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Base Pairs */}
    <line x1="80" y1="160" x2="120" y2="160" stroke="currentColor" strokeWidth="1" />
    <line x1="80" y1="175" x2="120" y2="175" stroke="currentColor" strokeWidth="1" />
    <line x1="80" y1="190" x2="120" y2="190" stroke="currentColor" strokeWidth="1" />
    
    {/* Binding Pocket / Interaction */}
    <circle cx="100" cy="120" r="8" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

export const NeuralTexture: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <circle cx="20" cy="20" r="2" fill="currentColor" />
    <circle cx="80" cy="40" r="2" fill="currentColor" />
    <circle cx="150" cy="30" r="2" fill="currentColor" />
    <circle cx="40" cy="100" r="2" fill="currentColor" />
    <circle cx="120" cy="110" r="2" fill="currentColor" />
    <circle cx="180" cy="90" r="2" fill="currentColor" />
    <circle cx="60" cy="170" r="2" fill="currentColor" />
    <circle cx="140" cy="160" r="2" fill="currentColor" />
    
    <path d="M20 20 L80 40 L150 30" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
    <path d="M20 20 L40 100 L120 110" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
    <path d="M80 40 L120 110 L180 90" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
    <path d="M40 100 L60 170 L140 160" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
    <path d="M120 110 L140 160" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export const DatabaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);