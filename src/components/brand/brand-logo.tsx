import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export function BrandLogo({
  className,
  compact = false,
  size = 'default',
}: BrandLogoProps) {
  if (compact) {
    return (
      <div className={cn('relative flex items-center justify-center shrink-0', className)}>
        <Image
          src="/favicon.png"
          alt="MultiCloud Studio"
          width={48}
          height={48}
          className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
          priority
          unoptimized
        />
      </div>
    );
  }

  const sizeClasses = {
    sm: 'h-7 sm:h-9 max-w-[130px] sm:max-w-[200px]',
    default: 'h-8 sm:h-11 max-w-[150px] sm:max-w-[240px]',
    lg: 'h-8 sm:h-10 md:h-12 max-w-[160px] sm:max-w-[240px] md:max-w-[300px]',
  };

  return (
    <div className={cn('relative flex items-center gap-2 shrink-0 py-0.5', className)}>
      <Image
        src="/logo.png"
        alt="MultiCloud Solution Studio"
        width={300}
        height={75}
        className={cn('w-auto object-contain transition-all', sizeClasses[size])}
        priority
        unoptimized
      />
    </div>
  );
}
