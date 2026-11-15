import React from 'react';
import type { ProviderId, ServiceCategory } from '@/lib/schemas';
import {
  Server,
  Cloud,
  Database,
  Cpu,
  HardDrive,
  Layers,
  Network,
  Shield,
  Activity,
  Zap,
  Terminal,
  FileCode,
  Radio,
  Lock,
  Globe,
  Sparkles,
  BarChart2,
  Box,
  Share2,
} from 'lucide-react';
import { ProviderIcon } from './provider-icons';

interface ServiceIconProps {
  iconKey: string;
  providerId: ProviderId;
  category: ServiceCategory;
  className?: string;
  size?: number;
}

export function ServiceIcon({
  iconKey,
  providerId,
  category,
  className = 'w-6 h-6',
  size = 24,
}: ServiceIconProps) {
  // Specific dedicated service icons (RF2-03)
  switch (iconKey) {
    // GCP Services
    case 'gcp-cloud-run':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#4285F4" fillOpacity="0.15" />
          <path d="M7 8L12 5L17 8V16L12 19L7 16V8Z" stroke="#4285F4" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 11V19M7 8L12 11L17 8" stroke="#4285F4" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );

    case 'gcp-bigquery':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#4285F4" fillOpacity="0.12" />
          <circle cx="11" cy="11" r="5" stroke="#4285F4" strokeWidth="2" />
          <path d="M15 15L19 19" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="9" y="8" width="4" height="6" rx="1" fill="#4285F4" />
        </svg>
      );

    case 'gcp-gke':
    case 'aws-eks':
    case 'azure-aks':
    case 'oci-oke':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#326CE5" fillOpacity="0.12" />
          <circle cx="12" cy="12" r="7" stroke="#326CE5" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="#326CE5" />
          <path d="M12 5V2M12 22V19M5 12H2M22 12H19" stroke="#326CE5" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'gcp-cloud-storage':
    case 'aws-s3':
    case 'azure-blob-storage':
    case 'oci-object-storage':
    case 'cloudflare-r2':
    case 'supabase-storage':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#0284C7" fillOpacity="0.12" />
          <path d="M5 8C5 6.34 8.13 5 12 5C15.87 5 19 6.34 19 8M5 8V16C5 17.66 8.13 19 12 19C15.87 19 19 17.66 19 16V8M5 8C5 9.66 8.13 11 12 11C15.87 11 19 9.66 19 8M5 12C5 13.66 8.13 15 12 15C15.87 15 19 13.66 19 12" stroke="#0284C7" strokeWidth="1.8" />
        </svg>
      );

    case 'gcp-cloud-sql':
    case 'aws-rds':
    case 'aws-aurora':
    case 'azure-sql-database':
    case 'azure-postgres':
    case 'oci-postgres':
    case 'supabase-postgres':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#059669" fillOpacity="0.12" />
          <ellipse cx="12" cy="7" rx="7" ry="3" stroke="#059669" strokeWidth="1.8" />
          <path d="M5 7V17C5 18.66 8.13 20 12 20C15.87 20 19 18.66 19 17V7" stroke="#059669" strokeWidth="1.8" />
          <path d="M5 12C5 13.66 8.13 15 12 15C15.87 15 19 13.66 19 12" stroke="#059669" strokeWidth="1.8" />
        </svg>
      );

    case 'aws-lambda':
    case 'azure-functions':
    case 'oci-functions':
    case 'supabase-edge-functions':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#D97706" fillOpacity="0.12" />
          <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#D97706" fillOpacity="0.2" />
        </svg>
      );

    case 'aws-dynamodb':
    case 'azure-cosmos-db':
    case 'gcp-firestore':
    case 'cloudflare-kv':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#2563EB" fillOpacity="0.12" />
          <path d="M6 7H18M6 12H18M6 17H14" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="17" r="2.5" fill="#2563EB" />
        </svg>
      );

    case 'gcp-vertex-ai':
    case 'aws-bedrock':
    case 'azure-openai':
    case 'oci-generative-ai':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#7C3AED" fillOpacity="0.12" />
          <path d="M12 3L14 9L20 11L14 13L12 19L10 13L4 11L10 9L12 3Z" stroke="#7C3AED" strokeWidth="1.8" strokeLinejoin="round" fill="#7C3AED" fillOpacity="0.2" />
        </svg>
      );

    case 'cloudflare-workers':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#F38020" fillOpacity="0.15" />
          <path d="M8 8L4 12L8 16M16 8L20 12L16 16M14 6L10 18" stroke="#F38020" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'cloudflare-d1':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#F38020" fillOpacity="0.12" />
          <rect x="5" y="6" width="14" height="12" rx="2" stroke="#F38020" strokeWidth="1.8" />
          <path d="M9 10H15M9 14H12" stroke="#F38020" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'cloudflare-waf':
    case 'gcp-cloud-armor':
    case 'aws-waf':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#DC2626" fillOpacity="0.12" />
          <path d="M12 4L4 7V12C4 16.5 7.5 20.5 12 21.5C16.5 20.5 20 16.5 20 12V7L12 4Z" stroke="#DC2626" strokeWidth="1.8" strokeLinejoin="round" fill="#DC2626" fillOpacity="0.1" />
        </svg>
      );

    case 'supabase-auth':
    case 'gcp-iam':
    case 'aws-iam':
    case 'azure-entra-id':
    case 'oci-iam':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#059669" fillOpacity="0.12" />
          <circle cx="12" cy="8" r="4" stroke="#059669" strokeWidth="1.8" />
          <path d="M5 20C5 16.13 8.13 13 12 13C15.87 13 19 16.13 19 20" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'supabase-realtime':
    case 'gcp-pubsub':
    case 'aws-sns':
    case 'aws-eventbridge':
    case 'azure-event-hubs':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#D97706" fillOpacity="0.12" />
          <circle cx="12" cy="12" r="2" fill="#D97706" />
          <path d="M8.5 8.5C10.4 6.6 13.6 6.6 15.5 8.5M5.5 5.5C9.1 1.9 14.9 1.9 18.5 5.5" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'oci-autonomous-database':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#C74634" fillOpacity="0.15" />
          <polygon points="12 4 20 12 12 20 4 12" stroke="#C74634" strokeWidth="2" fill="#C74634" fillOpacity="0.2" />
          <circle cx="12" cy="12" r="3" fill="#C74634" />
        </svg>
      );

    default:
      // Category fallback with provider identity badge
      return <CategoryFallbackIcon category={category} providerId={providerId} size={size} className={className} />;
  }
}

function CategoryFallbackIcon({
  category,
  providerId,
  size,
  className,
}: {
  category: ServiceCategory;
  providerId: ProviderId;
  size: number;
  className: string;
}) {
  switch (category) {
    case 'compute':
      return <Cpu size={size} className={className} />;
    case 'containers':
      return <Box size={size} className={className} />;
    case 'storage':
      return <HardDrive size={size} className={className} />;
    case 'databases':
      return <Database size={size} className={className} />;
    case 'networking':
      return <Network size={size} className={className} />;
    case 'analytics':
      return <BarChart2 size={size} className={className} />;
    case 'ai-ml':
      return <Sparkles size={size} className={className} />;
    case 'security':
      return <Shield size={size} className={className} />;
    case 'integration':
      return <Share2 size={size} className={className} />;
    case 'observability':
      return <Activity size={size} className={className} />;
    default:
      return <ProviderIcon providerId={providerId} size={size} className={className} />;
  }
}
