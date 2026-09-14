import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <img
      src="/LogoJejakTugas.jpeg"
      alt="Logo Jejak Tugas"
      className={`h-8 w-auto max-h-8 object-contain shrink-0 ${className}`}
    />
  );
};

