import React from 'react';
import type { ProviderId } from '@/lib/schemas';
import {
  Server,
  Cloud,
  Database,
  Shield,
  Layers,
  Globe,
  Terminal,
  Cpu,
} from 'lucide-react';

interface ProviderIconProps {
  providerId: ProviderId;
  className?: string;
  size?: number;
}

export function ProviderIcon({
  providerId,
  className = 'w-5 h-5',
  size = 20,
}: ProviderIconProps) {
  switch (providerId) {
    case 'gcp':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
            fill="#4285F4"
          />
          <path
            d="M12 8c1.66 0 3 1.34 3 3 0 .74-.27 1.42-.72 1.95l2.12 2.12c1-1.04 1.6-2.45 1.6-4.07 0-3.31-2.69-6-6-6v3z"
            fill="#EA4335"
          />
          <path
            d="M12 17c-1.66 0-3-1.34-3-3 0-.74.27-1.42.72-1.95L7.6 9.93C6.6 10.97 6 12.38 6 14c0 3.31 2.69 6 6 6v-3z"
            fill="#34A853"
          />
          <path
            d="M15.28 14.05c-.45.53-1.13.95-1.95.95v3c1.62 0 3.03-.6 4.07-1.6l-2.12-2.35z"
            fill="#FBBC05"
          />
        </svg>
      );

    case 'aws':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="4" fill="#232F3E" />
          <path
            d="M7 11.5L9.5 8L12 11.5H10.5V15H8.5V11.5H7Z"
            fill="#FF9900"
          />
          <path
            d="M13 8H15V15H13V8ZM16 8H18V13.5H16V8Z"
            fill="#FFFFFF"
          />
          <path
            d="M5 18C10 20.5 15 20.5 20 18"
            stroke="#FF9900"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'azure':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19L11.5 4H14.5L7 19H4Z"
            fill="#0078D4"
          />
          <path
            d="M12.5 14L15 8.5L20 19H10L12.5 14Z"
            fill="#50E6FF"
          />
          <path
            d="M12.5 14L10 19H17.5L12.5 14Z"
            fill="#0078D4"
          />
        </svg>
      );

    case 'oci':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="4" fill="#C74634" />
          <circle cx="12" cy="12" r="6" stroke="#FFFFFF" strokeWidth="2.5" />
        </svg>
      );

    case 'cloudflare':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.5 11C18 7.5 15 5 11.5 5 8.5 5 6 7 5.2 9.5 2.2 10 0 12.5 0 15.5 0 19 2.7 21 6 21H18.5C21.5 21 24 18.5 24 15.5 24 12.8 21.5 11.2 18.5 11Z"
            fill="#F38020"
          />
          <path
            d="M18.5 11C18 7.5 15 5 11.5 5 8.5 5 6 7 5.2 9.5 5.5 9.5 6 9.6 6.5 9.8 8.8 8.8 11.5 9.2 13 11c1.2.2 2.2.8 2.8 1.8 1.2.2 2.2 1 2.7 2.2.8-.2 1.5.1 2 .6.2-.8.2-1.7 0-2.6-.5-1-1.3-1.7-2-2z"
            fill="#FAAE40"
          />
        </svg>
      );

    case 'hostinger':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="4" fill="#673AB7" />
          <path
            d="M7 6V18M17 6V18M7 12H17"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'supabase':
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 2L3 14H11.5L10 22L20.5 9.5H12L12.5 2Z"
            fill="#3ECF8E"
          />
        </svg>
      );

    case 'custom':
    default:
      return <Server className={className} size={size} />;
  }
}
