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
          className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
          priority
          unoptimized
        />
      </div>
    );
  }

  const sizeClasses = {
    sm: 'h-9 sm:h-10 max-w-[200px]',
    default: 'h-11 sm:h-12 max-w-[260px]',
    lg: 'h-12 sm:h-14 md:h-16 max-w-[340px]',
  };

  return (
    <div className={cn('relative flex items-center gap-2.5 shrink-0 py-0.5', className)}>
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
