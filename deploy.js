#!/usr/bin/env node

/**
 * 🚀 Maya Voice Translator - Deployment Script
 * Automated deployment script for all environments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { environmentConfig } = require('./services/EnvironmentConfigService');

class DeploymentManager {
    constructor() {
        this.projectRoot = process.cwd();
        this.supportedEnvironments = ['development', 'staging', 'production'];
        this.supportedPlatforms = ['docker', 'kubernetes', 'aws'];
    }

    /**
     * Main deployment orchestrator
     */
    async deploy(options = {}) {
        const {
            environment = 'development',
            platform = 'docker',
            skipTests = false,
            dryRun = false,
            force = false
        } = options;

        console.log('🚀 Maya Voice Translator - Deployment Started');
        console.log(`📍 Environment: ${environment}`);
        console.log(`🏗️  Platform: ${platform}`);
        console.log(`⏰ Started at: ${new Date().toISOString()}`);
        console.log('=' .repeat(60));

        try {
            // Validate environment
            await this.validateEnvironment(environment);
            
            // Pre-deployment checks
            if (!skipTests) {
                await this.runTests();
            }
            
            // Generate configuration files
            await this.generateConfigs(environment);
            
            // Deploy based on platform
            switch (platform) {
                case 'docker':
                    await this.deployDocker(environment, dryRun);
                    break;
                case 'kubernetes':
                    await this.deployKubernetes(environment, dryRun);
                    break;
                case 'aws':
                    await this.deployAWS(environment, dryRun);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${platform}`);
            }

            // Post-deployment verification
            await this.verifyDeployment(environment, platform);
            
            console.log('✅ Deployment completed successfully!');
            return { success: true, environment, platform };

        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            if (!force) {
                await this.rollback(environment, platform);
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Validate environment configuration
     */
    async validateEnvironment(environment) {
        console.log('🔍 Validating environment configuration...');
        
        if (!this.supportedEnvironments.includes(environment)) {
            throw new Error(`Unsupported environment: ${environment}`);
        }

        const validation = environmentConfig.validateConfig(environment);
        if (!validation.valid) {
            throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
        }

        // Check required files
        const requiredFiles = [
            'package.json',
            'api-server.js',
            'Dockerfile',
            'docker-compose.yml'
        ];

        for (const file of requiredFiles) {
            if (!fs.existsSync(path.join(this.projectRoot, file))) {
                throw new Error(`Required file missing: ${file}`);
            }
        }

        console.log('✅ Environment validation passed');
    }

    /**
     * Run tests before deployment
     */
    async runTests() {
        console.log('🧪 Running tests...');
        
        try {
            // Run different test suites
            this.runCommand('node test-phase3-simple.js');
            this.runCommand('node test-integration-advanced.js');
            
            console.log('✅ All tests passed');
        } catch (error) {
            throw new Error(`Tests failed: ${error.message}`);
        }
    }

    /**
     * Generate configuration files for deployment
     */
    async generateConfigs(environment) {
        console.log('📝 Generating configuration files...');
        
        const result = await environmentConfig.saveConfigFiles(environment);
        if (!result.success) {
            throw new Error(`Config generation failed: ${result.error}`);
        }

        console.log(`✅ Configuration files generated in ${result.path}`);
    }

    /**
     * Deploy using Docker Compose
     */
    async deployDocker(environment, dryRun = false) {
        console.log('🐳 Deploying with Docker...');
        
        const commands = [
            'docker compose down',
            'docker compose build --no-cache',
            'docker compose up -d'
        ];

        if (environment !== 'development') {
            commands.push('docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d');
        }

        for (const command of commands) {
            if (dryRun) {
                console.log(`[DRY RUN] ${command}`);
            } else {
                this.runCommand(command);
            }
        }

        if (!dryRun) {
            // Wait for services to start
            console.log('⏳ Waiting for services to start...');
            await this.sleep(30000); // 30 seconds
        }

        console.log('✅ Docker deployment completed');
    }

    /**
     * Deploy to Kubernetes
     */
    async deployKubernetes(environment, dryRun = false) {
        console.log('☸️  Deploying to Kubernetes...');
        
        const deployDir = `./deploy/${environment}`;
        const commands = [
            `kubectl apply -f ${deployDir}/k8s-deployment.yaml`,
            `kubectl apply -f ${deployDir}/k8s-service.yaml`,
            `kubectl rollout status deployment/maya-translator-${environment}`,
        ];

        for (const command of commands) {
            if (dryRun) {
                console.log(`[DRY RUN] ${command}`);
            } else {
                this.runCommand(command);
            }
        }

        console.log('✅ Kubernetes deployment completed');
    }

    /**
     * Deploy to AWS using Terraform
     */
    async deployAWS(environment, dryRun = false) {
        console.log('☁️  Deploying to AWS...');
        
        const terraformDir = `./deploy/${environment}`;
        const commands = [
            `cd ${terraformDir} && terraform init`,
            `cd ${terraformDir} && terraform plan`,
            dryRun ? '' : `cd ${terraformDir} && terraform apply -auto-approve`
        ].filter(cmd => cmd);

        for (const command of commands) {
            if (dryRun) {
                console.log(`[DRY RUN] ${command}`);
            } else {
                this.runCommand(command);
            }
        }

        console.log('✅ AWS deployment completed');
    }

    /**
     * Verify deployment success
     */
    async verifyDeployment(environment, platform) {
        console.log('🔍 Verifying deployment...');
        
        const config = environmentConfig.environments[environment];
        const healthUrl = `${config.api_url}/api/health`;

        try {
            // Wait a bit for services to fully start
            await this.sleep(10000);
            
            // Check health endpoint
            this.runCommand(`curl -f ${healthUrl} || exit 1`);
            
            // Additional platform-specific checks
            switch (platform) {
                case 'docker':
                    this.runCommand('docker compose ps');
                    break;
                case 'kubernetes':
                    this.runCommand(`kubectl get pods -l app=maya-translator,environment=${environment}`);
                    break;
                case 'aws':
                    // AWS-specific health checks
                    break;
            }

            console.log('✅ Deployment verification passed');

        } catch (error) {
            throw new Error(`Deployment verification failed: ${error.message}`);
        }
    }

    /**
     * Rollback deployment on failure
     */
    async rollback(environment, platform) {
        console.log('🔄 Rolling back deployment...');
        
        try {
            switch (platform) {
                case 'docker':
                    this.runCommand('docker compose down');
                    break;
                case 'kubernetes':
                    this.runCommand(`kubectl rollout undo deployment/maya-translator-${environment}`);
                    break;
                case 'aws':
                    // AWS rollback logic
                    break;
            }
            
            console.log('✅ Rollback completed');
        } catch (rollbackError) {
            console.error('❌ Rollback failed:', rollbackError.message);
        }
    }

    /**
     * Setup monitoring and alerting
     */
    async setupMonitoring(environment) {
        console.log('📊 Setting up monitoring...');
        
        const monitoringCommands = [
            'docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d prometheus grafana',
            'docker compose exec prometheus prometheus --config.file=/etc/prometheus/prometheus.yml',
        ];

        for (const command of monitoringCommands) {
            try {
                this.runCommand(command);
            } catch (error) {
                console.warn(`⚠️  Monitoring setup warning: ${error.message}`);
            }
        }

        console.log('✅ Monitoring setup completed');
    }

    /**
     * Database migration
     */
    async runMigrations(environment) {
        console.log('🗄️  Running database migrations...');
        
        const config = environmentConfig.environments[environment];
        
        try {
            // Run SQL initialization script
            this.runCommand(`docker compose exec postgres psql ${config.database_url} -f /docker-entrypoint-initdb.d/init-db.sql`);
            
            console.log('✅ Database migrations completed');
        } catch (error) {
            console.warn(`⚠️  Migration warning: ${error.message}`);
        }
    }

    /**
     * Generate deployment report
     */
    generateReport(deploymentResult) {
        const report = {
            timestamp: new Date().toISOString(),
            environment: deploymentResult.environment,
            platform: deploymentResult.platform,
            success: deploymentResult.success,
            deploymentInfo: environmentConfig.getDeploymentInfo(),
            services: [
                'maya-api',
                'postgres',
                'redis',
                'elasticsearch',
                'prometheus',
                'grafana'
            ],
            endpoints: {
                api: environmentConfig.get('api_url'),
                dashboard: environmentConfig.get('api_url').replace('api.', 'dashboard.'),
                monitoring: environmentConfig.get('api_url').replace('api.', 'prometheus.')
            }
        };

        const reportPath = `./deploy/deployment-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📋 Deployment report saved to: ${reportPath}`);
        return report;
    }

    /**
     * Utility method to run shell commands
     */
    runCommand(command) {
        console.log(`🔧 Running: ${command}`);
        return execSync(command, { 
            stdio: 'inherit', 
            cwd: this.projectRoot,
            encoding: 'utf8'
        });
    }

    /**
     * Utility method for delays
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clean up old deployments
     */
    async cleanup(environment, keepLast = 5) {
        console.log('🧹 Cleaning up old deployments...');
        
        try {
            // Clean up old Docker images
            this.runCommand('docker image prune -f');
            
            // Clean up old logs
            this.runCommand('docker compose logs --tail=1000 > ./logs/deployment.log');
            
            console.log('✅ Cleanup completed');
        } catch (error) {
            console.warn(`⚠️  Cleanup warning: ${error.message}`);
        }
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    const deployer = new DeploymentManager();
    
    switch (command) {
        case 'deploy':
            const options = {
                environment: args[1] || 'development',
                platform: args[2] || 'docker',
                skipTests: args.includes('--skip-tests'),
                dryRun: args.includes('--dry-run'),
                force: args.includes('--force')
            };
            
            const result = await deployer.deploy(options);
            deployer.generateReport(result);
            process.exit(result.success ? 0 : 1);
            
        case 'rollback':
            await deployer.rollback(args[1] || 'development', args[2] || 'docker');
            break;
            
        case 'monitor':
            await deployer.setupMonitoring(args[1] || 'development');
            break;
            
        case 'migrate':
            await deployer.runMigrations(args[1] || 'development');
            break;
            
        case 'cleanup':
            await deployer.cleanup(args[1] || 'development');
            break;
            
        default:
            console.log(`
🚀 Maya Voice Translator - Deployment Manager

Usage:
  node deploy.js deploy [environment] [platform] [options]
  node deploy.js rollback [environment] [platform]
  node deploy.js monitor [environment]
  node deploy.js migrate [environment]
  node deploy.js cleanup [environment]

Environments: development, staging, production
Platforms: docker, kubernetes, aws

Options:
  --skip-tests   Skip running tests before deployment
  --dry-run      Show commands without executing them
  --force        Continue deployment even if it fails

Examples:
  node deploy.js deploy development docker
  node deploy.js deploy staging kubernetes --skip-tests
  node deploy.js deploy production aws --dry-run
            `);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Deployment script failed:', error);
        process.exit(1);
    });
}

module.exports = DeploymentManager;
