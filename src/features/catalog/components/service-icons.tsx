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
import { cn } from '@/lib/utils';

interface ServiceIconProps {
  iconKey: string;
  providerId: ProviderId;
  category: ServiceCategory;
  className?: string;
  size?: number;
}

// Registry mapping service IDs to verified local official vendor SVGs from assets/cloud-icons-library
export const OFFICIAL_SVG_MAP: Record<string, string> = {
  // GCP Official SVGs
  'gcp-cloud-run': '/cloud-icons/gcp-icons/Cloud-Run.svg',
  'gcp-bigquery': '/cloud-icons/gcp-icons/BigQuery.svg',
  'gcp-compute-engine': '/cloud-icons/gcp-icons/Compute-Engine.svg',
  'gcp-cloud-storage': '/cloud-icons/gcp-icons/Cloud-Storage.svg',
  'gcp-cloud-sql': '/cloud-icons/gcp-icons/Cloud-SQL.svg',
  'gcp-gke': '/cloud-icons/gcp-icons/Google-Kubernetes-Engine.svg',
  'gcp-vertex-ai': '/cloud-icons/gcp-icons/Vertex-AI.svg',
  'gcp-pubsub': '/cloud-icons/gcp-icons/PubSub.svg',
  'gcp-spanner': '/cloud-icons/gcp-icons/Cloud-Spanner.svg',
  'gcp-firestore': '/cloud-icons/gcp-icons/Firestore.svg',
  'gcp-bigtable': '/cloud-icons/gcp-icons/Bigtable.svg',
  'gcp-cloud-functions': '/cloud-icons/gcp-icons/Cloud-Functions.svg',
  'gcp-app-engine': '/cloud-icons/gcp-icons/App-Engine.svg',
  'gcp-batch': '/cloud-icons/gcp-icons/Batch.svg',
  'gcp-cloud-armor': '/cloud-icons/gcp-icons/Cloud-Armor.svg',
  'gcp-cloud-dns': '/cloud-icons/gcp-icons/Cloud-DNS.svg',
  'gcp-cloud-cdn': '/cloud-icons/gcp-icons/Cloud-CDN.svg',
  'gcp-cloud-nat': '/cloud-icons/gcp-icons/Cloud-NAT.svg',
  'gcp-cloud-build': '/cloud-icons/gcp-icons/Cloud-Build.svg',
  'gcp-artifact-registry': '/cloud-icons/gcp-icons/Artifact-Registry.svg',
  'gcp-secret-manager': '/cloud-icons/gcp-icons/Secret-Manager.svg',
  'gcp-cloud-kms': '/cloud-icons/gcp-icons/Key-Management-Service.svg',
  'gcp-iam': '/cloud-icons/gcp-icons/Identity-And-Access-Management.svg',
  'gcp-cloud-logging': '/cloud-icons/gcp-icons/Cloud-Logging.svg',
  'gcp-cloud-monitoring': '/cloud-icons/gcp-icons/Cloud-Monitoring.svg',
  'gcp-filestore': '/cloud-icons/gcp-icons/Filestore.svg',
  'gcp-persistent-disk': '/cloud-icons/gcp-icons/Persistent-Disk.svg',
  'gcp-cloud-load-balancing': '/cloud-icons/gcp-icons/Cloud-Load-Balancing.svg',
  'gcp-vpc': '/cloud-icons/gcp-icons/Virtual-Private-Cloud.svg',
  'gcp-cloud-interconnect': '/cloud-icons/gcp-icons/Cloud-Interconnect.svg',
  'gcp-dataflow': '/cloud-icons/gcp-icons/Dataflow.svg',
  'gcp-dataproc': '/cloud-icons/gcp-icons/Dataproc.svg',
  'gcp-memorystore': '/cloud-icons/gcp-icons/Memorystore.svg',
  'gcp-looker': '/cloud-icons/gcp-icons/Looker.svg',
  'gcp-alloydb': '/cloud-icons/gcp-icons/AlloyDB.svg',

  // AWS Official SVGs
  'aws-ec2': '/cloud-icons/aws-icons/Compute/EC2.svg',
  'aws-lambda': '/cloud-icons/aws-icons/Compute/Lambda.svg',
  'aws-s3': '/cloud-icons/aws-icons/Storage/Simple-Storage-Service.svg',
  'aws-ebs': '/cloud-icons/aws-icons/Storage/Elastic-Block-Store.svg',
  'aws-efs': '/cloud-icons/aws-icons/Storage/EFS.svg',
  'aws-rds': '/cloud-icons/aws-icons/Database/RDS.svg',
  'aws-dynamodb': '/cloud-icons/aws-icons/Database/DynamoDB.svg',
  'aws-aurora': '/cloud-icons/aws-icons/Database/Aurora.svg',
  'aws-elasticache': '/cloud-icons/aws-icons/Database/ElastiCache.svg',
  'aws-ecs': '/cloud-icons/aws-icons/Containers/Elastic-Container-Service.svg',
  'aws-eks': '/cloud-icons/aws-icons/Containers/Elastic-Kubernetes-Service.svg',
  'aws-fargate': '/cloud-icons/aws-icons/Compute/Fargate.svg',
  'aws-ecr': '/cloud-icons/aws-icons/Containers/Elastic-Container-Registry.svg',
  'aws-app-runner': '/cloud-icons/aws-icons/Compute/App-Runner.svg',
  'aws-cloudfront': '/cloud-icons/aws-icons/Networking-Content-Delivery/CloudFront.svg',
  'aws-route53': '/cloud-icons/aws-icons/Networking-Content-Delivery/Route-53.svg',
  'aws-api-gateway': '/cloud-icons/aws-icons/App-Integration/API-Gateway.svg',
  'aws-sqs': '/cloud-icons/aws-icons/App-Integration/Simple-Queue-Service.svg',
  'aws-sns': '/cloud-icons/aws-icons/App-Integration/Simple-Notification-Service.svg',
  'aws-eventbridge': '/cloud-icons/aws-icons/App-Integration/EventBridge.svg',
  'aws-step-functions': '/cloud-icons/aws-icons/App-Integration/Step-Functions.svg',
  'aws-athena': '/cloud-icons/aws-icons/Analytics/Athena.svg',
  'aws-redshift': '/cloud-icons/aws-icons/Analytics/Redshift.svg',
  'aws-kinesis': '/cloud-icons/aws-icons/Analytics/Kinesis.svg',
  'aws-glue': '/cloud-icons/aws-icons/Analytics/Glue.svg',
  'aws-sagemaker': '/cloud-icons/aws-icons/Machine-Learning/SageMaker.svg',
  'aws-iam': '/cloud-icons/aws-icons/Security-Identity-Compliance/Identity-and-Access-Management.svg',
  'aws-kms': '/cloud-icons/aws-icons/Security-Identity-Compliance/Key-Management-Service.svg',
  'aws-secrets-manager': '/cloud-icons/aws-icons/Security-Identity-Compliance/Secrets-Manager.svg',
  'aws-cognito': '/cloud-icons/aws-icons/Security-Identity-Compliance/Cognito.svg',
  'aws-waf': '/cloud-icons/aws-icons/Security-Identity-Compliance/WAF.svg',
  'aws-cloudwatch': '/cloud-icons/aws-icons/Management-Governance/CloudWatch.svg',
  'aws-cloudtrail': '/cloud-icons/aws-icons/Management-Governance/CloudTrail.svg',
  'aws-vpc': '/cloud-icons/aws-icons/Networking-Content-Delivery/Virtual-Private-Cloud.svg',
  'aws-elb': '/cloud-icons/aws-icons/Networking-Content-Delivery/Elastic-Load-Balancing.svg',
  'aws-direct-connect': '/cloud-icons/aws-icons/Networking-Content-Delivery/Direct-Connect.svg',
  'aws-lightsail': '/cloud-icons/aws-icons/Compute/Lightsail.svg',
  'aws-elastic-beanstalk': '/cloud-icons/aws-icons/Compute/Elastic-Beanstalk.svg',
  'aws-documentdb': '/cloud-icons/aws-icons/Database/DocumentDB.svg',
  'aws-neptune': '/cloud-icons/aws-icons/Database/Neptune.svg',
  'aws-msk': '/cloud-icons/aws-icons/Analytics/Managed-Streaming-for-Apache-Kafka.svg',
  'aws-quicksight': '/cloud-icons/aws-icons/Analytics/QuickSight.svg',
  'aws-guardduty': '/cloud-icons/aws-icons/Security-Identity-Compliance/GuardDuty.svg',
  'aws-xray': '/cloud-icons/aws-icons/Developer-Tools/X-Ray.svg',

  // Azure Official SVGs
  'azure-functions': '/cloud-icons/azure-icons/Icons/compute/10029-icon-service-Function-Apps.svg',
  'azure-virtual-machines': '/cloud-icons/azure-icons/Icons/compute/10021-icon-service-Virtual-Machine.svg',
  'azure-app-service': '/cloud-icons/azure-icons/Icons/compute/10035-icon-service-App-Services.svg',
  'azure-aks': '/cloud-icons/azure-icons/Icons/containers/10023-icon-service-Kubernetes-Services.svg',
  'azure-container-apps': '/cloud-icons/azure-icons/Icons/other/02989-icon-service-Container-Apps-Environments.svg',
  'azure-container-registry': '/cloud-icons/azure-icons/Icons/containers/10105-icon-service-Container-Registries.svg',
  'azure-container-instances': '/cloud-icons/azure-icons/Icons/containers/10104-icon-service-Container-Instances.svg',
  'azure-blob-storage': '/cloud-icons/azure-icons/Icons/storage/10086-icon-service-Storage-Accounts.svg',
  'azure-files': '/cloud-icons/azure-icons/Icons/general/10838-icon-service-Storage-Azure-Files.svg',
  'azure-sql-database': '/cloud-icons/azure-icons/Icons/databases/10130-icon-service-SQL-Database.svg',
  'azure-cosmos-db': '/cloud-icons/azure-icons/Icons/databases/10121-icon-service-Azure-Cosmos-DB.svg',
  'azure-postgres': '/cloud-icons/azure-icons/Icons/databases/10131-icon-service-Azure-Database-PostgreSQL-Server.svg',
  'azure-mysql': '/cloud-icons/azure-icons/Icons/databases/10122-icon-service-Azure-Database-MySQL-Server.svg',
  'azure-redis': '/cloud-icons/azure-icons/Icons/databases/10137-icon-service-Cache-Redis.svg',
  'azure-vnet': '/cloud-icons/azure-icons/Icons/networking/10061-icon-service-Virtual-Networks.svg',
  'azure-front-door': '/cloud-icons/azure-icons/Icons/networking/10073-icon-service-Front-Door-and-CDN-Profiles.svg',
  'azure-application-gateway': '/cloud-icons/azure-icons/Icons/networking/10076-icon-service-Application-Gateways.svg',
  'azure-load-balancer': '/cloud-icons/azure-icons/Icons/networking/10062-icon-service-Load-Balancers.svg',
  'azure-synapse': '/cloud-icons/azure-icons/Icons/analytics/00606-icon-service-Azure-Synapse-Analytics.svg',
  'azure-data-factory': '/cloud-icons/azure-icons/Icons/databases/10126-icon-service-Data-Factories.svg',
  'azure-event-hubs': '/cloud-icons/azure-icons/Icons/analytics/00039-icon-service-Event-Hubs.svg',
  'azure-openai': '/cloud-icons/azure-icons/Icons/ai + machine learning/03438-icon-service-Azure-OpenAI.svg',
  'azure-ai-search': '/cloud-icons/azure-icons/Icons/ai + machine learning/10044-icon-service-Cognitive-Search.svg',
  'azure-key-vault': '/cloud-icons/azure-icons/Icons/security/10245-icon-service-Key-Vaults.svg',
  'azure-defender': '/cloud-icons/azure-icons/Icons/security/10241-icon-service-Microsoft-Defender-for-Cloud.svg',
  'azure-monitor': '/cloud-icons/azure-icons/Icons/monitor/00001-icon-service-Monitor.svg',
};

export function ServiceIcon({
  iconKey,
  providerId,
  category,
  className = 'w-6 h-6',
  size = 24,
}: ServiceIconProps) {
  // 1. If an official local vendor SVG exists in assets/cloud-icons-library, render it directly
  if (OFFICIAL_SVG_MAP[iconKey]) {
    return (
      <img
        src={OFFICIAL_SVG_MAP[iconKey]}
        alt=""
        width={size}
        height={size}
        className={cn('object-contain shrink-0', className)}
        loading="lazy"
      />
    );
  }

  // 2. Specific dedicated vector icons for Cloudflare, Supabase, OCI, Hostinger
  switch (iconKey) {
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

    case 'cloudflare-r2':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#0284C7" fillOpacity="0.12" />
          <path d="M5 8C5 6.34 8.13 5 12 5C15.87 5 19 6.34 19 8M5 8V16C5 17.66 8.13 19 12 19C15.87 19 19 17.66 19 16V8M5 8C5 9.66 8.13 11 12 11C15.87 11 19 9.66 19 8M5 12C5 13.66 8.13 15 12 15C15.87 15 19 13.66 19 12" stroke="#0284C7" strokeWidth="1.8" />
        </svg>
      );

    case 'cloudflare-waf':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#DC2626" fillOpacity="0.12" />
          <path d="M12 4L4 7V12C4 16.5 7.5 20.5 12 21.5C16.5 20.5 20 16.5 20 12V7L12 4Z" stroke="#DC2626" strokeWidth="1.8" strokeLinejoin="round" fill="#DC2626" fillOpacity="0.1" />
        </svg>
      );

    case 'supabase-postgres':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#3ECF8E" fillOpacity="0.12" />
          <ellipse cx="12" cy="7" rx="7" ry="3" stroke="#059669" strokeWidth="1.8" />
          <path d="M5 7V17C5 18.66 8.13 20 12 20C15.87 20 19 18.66 19 17V7" stroke="#059669" strokeWidth="1.8" />
          <path d="M5 12C5 13.66 8.13 15 12 15C15.87 15 19 13.66 19 12" stroke="#059669" strokeWidth="1.8" />
        </svg>
      );

    case 'supabase-auth':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#3ECF8E" fillOpacity="0.12" />
          <circle cx="12" cy="8" r="4" stroke="#059669" strokeWidth="1.8" />
          <path d="M5 20C5 16.13 8.13 13 12 13C15.87 13 19 16.13 19 20" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'supabase-realtime':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#3ECF8E" fillOpacity="0.12" />
          <circle cx="12" cy="12" r="2" fill="#059669" />
          <path d="M8.5 8.5C10.4 6.6 13.6 6.6 15.5 8.5M5.5 5.5C9.1 1.9 14.9 1.9 18.5 5.5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" />
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
