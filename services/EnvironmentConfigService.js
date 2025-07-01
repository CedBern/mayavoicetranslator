/**
 * 🔧 Environment Configuration Service for Maya Voice Translator
 * Manages deployment environments and configurations
 */

const fs = require('fs');
const path = require('path');

class EnvironmentConfigService {
    constructor() {
        this.environments = {
            development: {
                name: 'Development',
                api_url: 'http://localhost:3000',
                database_url: 'postgresql://maya_user:maya_password@localhost:5432/maya_dev',
                redis_url: 'redis://localhost:6379',
                log_level: 'debug',
                features: {
                    analytics: true,
                    monitoring: false,
                    ai_models: true,
                    voice_synthesis: true,
                    offline_mode: true
                }
            },
            staging: {
                name: 'Staging',
                api_url: 'https://staging-api.mayatranslator.com',
                database_url: process.env.STAGING_DATABASE_URL,
                redis_url: process.env.STAGING_REDIS_URL,
                log_level: 'info',
                features: {
                    analytics: true,
                    monitoring: true,
                    ai_models: true,
                    voice_synthesis: true,
                    offline_mode: true
                }
            },
            production: {
                name: 'Production',
                api_url: 'https://api.mayatranslator.com',
                database_url: process.env.DATABASE_URL,
                redis_url: process.env.REDIS_URL,
                log_level: 'warn',
                features: {
                    analytics: true,
                    monitoring: true,
                    ai_models: true,
                    voice_synthesis: true,
                    offline_mode: true
                }
            }
        };

        this.currentEnvironment = process.env.NODE_ENV || 'development';
    }

    /**
     * Get current environment configuration
     */
    getConfig() {
        return this.environments[this.currentEnvironment] || this.environments.development;
    }

    /**
     * Get specific configuration value
     */
    get(key, defaultValue = null) {
        const config = this.getConfig();
        return this.getNestedValue(config, key) || defaultValue;
    }

    /**
     * Check if feature is enabled
     */
    isFeatureEnabled(feature) {
        const config = this.getConfig();
        return config.features && config.features[feature] === true;
    }

    /**
     * Generate Docker Compose override for environment
     */
    generateDockerOverride(environment = this.currentEnvironment) {
        const config = this.environments[environment];
        if (!config) {
            throw new Error(`Environment ${environment} not found`);
        }

        const override = {
            version: '3.8',
            services: {
                'maya-api': {
                    environment: [
                        `NODE_ENV=${environment}`,
                        `LOG_LEVEL=${config.log_level}`,
                        `API_URL=${config.api_url}`,
                        `DATABASE_URL=${config.database_url}`,
                        `REDIS_URL=${config.redis_url}`
                    ]
                }
            }
        };

        // Add monitoring services for staging/production
        if (environment !== 'development') {
            override.services['maya-api'].environment.push(
                'MONITORING_ENABLED=true',
                'ANALYTICS_ENABLED=true'
            );
        }

        return override;
    }

    /**
     * Generate environment-specific Kubernetes manifests
     */
    generateKubernetesManifests(environment = this.currentEnvironment) {
        const config = this.environments[environment];
        
        const deployment = {
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            metadata: {
                name: `maya-translator-${environment}`,
                namespace: environment === 'production' ? 'production' : 'staging',
                labels: {
                    app: 'maya-translator',
                    environment: environment,
                    version: 'v1.0.0'
                }
            },
            spec: {
                replicas: environment === 'production' ? 3 : 1,
                selector: {
                    matchLabels: {
                        app: 'maya-translator',
                        environment: environment
                    }
                },
                template: {
                    metadata: {
                        labels: {
                            app: 'maya-translator',
                            environment: environment
                        }
                    },
                    spec: {
                        containers: [{
                            name: 'maya-translator',
                            image: `ghcr.io/maya-voice-translator:${environment}`,
                            ports: [{ containerPort: 3000 }],
                            env: [
                                { name: 'NODE_ENV', value: environment },
                                { name: 'LOG_LEVEL', value: config.log_level },
                                { name: 'API_URL', value: config.api_url },
                                { 
                                    name: 'DATABASE_URL', 
                                    valueFrom: { 
                                        secretKeyRef: { 
                                            name: 'maya-secrets', 
                                            key: 'database-url' 
                                        } 
                                    } 
                                },
                                { 
                                    name: 'REDIS_URL', 
                                    valueFrom: { 
                                        secretKeyRef: { 
                                            name: 'maya-secrets', 
                                            key: 'redis-url' 
                                        } 
                                    } 
                                }
                            ],
                            resources: {
                                requests: {
                                    memory: environment === 'production' ? '512Mi' : '256Mi',
                                    cpu: environment === 'production' ? '500m' : '250m'
                                },
                                limits: {
                                    memory: environment === 'production' ? '1Gi' : '512Mi',
                                    cpu: environment === 'production' ? '1000m' : '500m'
                                }
                            },
                            livenessProbe: {
                                httpGet: {
                                    path: '/api/health',
                                    port: 3000
                                },
                                initialDelaySeconds: 30,
                                periodSeconds: 10
                            },
                            readinessProbe: {
                                httpGet: {
                                    path: '/api/ready',
                                    port: 3000
                                },
                                initialDelaySeconds: 5,
                                periodSeconds: 5
                            }
                        }]
                    }
                }
            }
        };

        const service = {
            apiVersion: 'v1',
            kind: 'Service',
            metadata: {
                name: `maya-translator-service-${environment}`,
                namespace: environment === 'production' ? 'production' : 'staging'
            },
            spec: {
                selector: {
                    app: 'maya-translator',
                    environment: environment
                },
                ports: [{
                    protocol: 'TCP',
                    port: 80,
                    targetPort: 3000
                }],
                type: 'ClusterIP'
            }
        };

        return { deployment, service };
    }

    /**
     * Generate Terraform configuration for infrastructure
     */
    generateTerraformConfig(environment = this.currentEnvironment) {
        const config = this.environments[environment];
        
        return `
# 🏗️ Terraform Configuration for Maya Voice Translator - ${environment}

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
  
  backend "s3" {
    bucket = "maya-translator-terraform-state"
    key    = "${environment}/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# EKS Cluster
resource "aws_eks_cluster" "maya_cluster" {
  name     = "maya-translator-${environment}"
  role_arn = aws_iam_role.cluster_role.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = var.subnet_ids
    endpoint_config {
      private_access = true
      public_access  = true
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
  ]
}

# RDS PostgreSQL
resource "aws_db_instance" "maya_postgres" {
  identifier     = "maya-translator-${environment}"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "${environment === 'production' ? 'db.t3.medium' : 'db.t3.micro'}"
  allocated_storage = ${environment === 'production' ? 100 : 20}
  
  db_name  = "maya_db"
  username = var.db_username
  password = var.db_password
  
  backup_retention_period = ${environment === 'production' ? 7 : 1}
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = ${environment !== 'production'}
  deletion_protection = ${environment === 'production'}
  
  tags = {
    Environment = "${environment}"
    Application = "maya-translator"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "maya_redis" {
  cluster_id           = "maya-translator-${environment}"
  engine               = "redis"
  node_type            = "${environment === 'production' ? 'cache.t3.medium' : 'cache.t3.micro'}"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  
  tags = {
    Environment = "${environment}"
    Application = "maya-translator"
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "db_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Outputs
output "cluster_endpoint" {
  value = aws_eks_cluster.maya_cluster.endpoint
}

output "database_endpoint" {
  value = aws_db_instance.maya_postgres.endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.maya_redis.cache_nodes[0].address
}
        `.trim();
    }

    /**
     * Generate GitHub Actions secrets for environment
     */
    generateGitHubSecrets(environment = this.currentEnvironment) {
        const config = this.environments[environment];
        
        return {
            [`${environment.toUpperCase()}_DATABASE_URL`]: config.database_url,
            [`${environment.toUpperCase()}_REDIS_URL`]: config.redis_url,
            [`${environment.toUpperCase()}_API_URL`]: config.api_url,
            [`${environment.toUpperCase()}_LOG_LEVEL`]: config.log_level,
            'AWS_ACCESS_KEY_ID': 'your-aws-access-key',
            'AWS_SECRET_ACCESS_KEY': 'your-aws-secret-key',
            'SLACK_WEBHOOK': 'your-slack-webhook-url',
            'DOCKER_REGISTRY_TOKEN': 'your-docker-registry-token'
        };
    }

    /**
     * Save configuration files to disk
     */
    async saveConfigFiles(environment = this.currentEnvironment, outputDir = './deploy') {
        const dir = path.join(outputDir, environment);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        try {
            // Docker Compose override
            const dockerOverride = this.generateDockerOverride(environment);
            fs.writeFileSync(
                path.join(dir, 'docker-compose.override.yml'),
                `# Generated docker-compose override for ${environment}\n` +
                require('js-yaml').dump(dockerOverride)
            );

            // Kubernetes manifests
            const k8sManifests = this.generateKubernetesManifests(environment);
            fs.writeFileSync(
                path.join(dir, 'k8s-deployment.yaml'),
                require('js-yaml').dump(k8sManifests.deployment)
            );
            fs.writeFileSync(
                path.join(dir, 'k8s-service.yaml'),
                require('js-yaml').dump(k8sManifests.service)
            );

            // Terraform configuration
            const terraformConfig = this.generateTerraformConfig(environment);
            fs.writeFileSync(
                path.join(dir, 'main.tf'),
                terraformConfig
            );

            // GitHub secrets (as JSON for reference)
            const githubSecrets = this.generateGitHubSecrets(environment);
            fs.writeFileSync(
                path.join(dir, 'github-secrets.json'),
                JSON.stringify(githubSecrets, null, 2)
            );

            console.log(`✅ Configuration files generated for ${environment} in ${dir}`);
            return { success: true, path: dir };

        } catch (error) {
            console.error(`❌ Error generating config files for ${environment}:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Helper method to get nested object values
     */
    getNestedValue(obj, key) {
        return key.split('.').reduce((o, k) => (o || {})[k], obj);
    }

    /**
     * Validate environment configuration
     */
    validateConfig(environment = this.currentEnvironment) {
        const config = this.environments[environment];
        if (!config) {
            return { valid: false, errors: [`Environment ${environment} not found`] };
        }

        const errors = [];
        
        // Required fields
        const required = ['name', 'api_url', 'database_url', 'redis_url', 'log_level'];
        for (const field of required) {
            if (!config[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        }

        // URL validation
        const urls = ['api_url', 'database_url', 'redis_url'];
        for (const url of urls) {
            if (config[url] && !this.isValidUrl(config[url])) {
                errors.push(`Invalid URL format for ${url}: ${config[url]}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Simple URL validation
     */
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Get deployment status information
     */
    getDeploymentInfo() {
        const config = this.getConfig();
        
        return {
            environment: this.currentEnvironment,
            name: config.name,
            api_url: config.api_url,
            features: config.features,
            log_level: config.log_level,
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0'
        };
    }
}

// Export singleton instance
const environmentConfig = new EnvironmentConfigService();

// Export both class and instance
module.exports = {
    EnvironmentConfigService,
    environmentConfig
};

// Export default instance
module.exports.default = environmentConfig;
