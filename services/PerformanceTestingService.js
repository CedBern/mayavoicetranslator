/**
 * 🏋️ Performance Testing Service for Maya Voice Translator
 * Advanced load testing and performance monitoring
 */

const http = require('http');
const https = require('https');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');

// Pour ES modules compatibility
const __filename = require.main?.filename || __filename;
const __dirname = path.dirname(__filename);

class PerformanceTestingService {
    constructor() {
        this.baseUrl = process.env.API_URL || 'http://localhost:3000';
        this.testResults = {
            startTime: null,
            endTime: null,
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            minResponseTime: Infinity,
            maxResponseTime: 0,
            requestsPerSecond: 0,
            errorRate: 0,
            responseTimePercentiles: {},
            memoryUsage: [],
            cpuUsage: [],
            errors: []
        };
        
        this.testScenarios = {
            translation: {
                endpoint: '/api/translate',
                method: 'POST',
                body: {
                    text: 'Hello, how are you?',
                    fromLang: 'en',
                    toLang: 'maya-yucateco'
                }
            },
            voice: {
                endpoint: '/api/voice/synthesize',
                method: 'POST',
                body: {
                    text: 'Ba\'ax ka wa\'alik',
                    language: 'maya-yucateco'
                }
            },
            search: {
                endpoint: '/api/search',
                method: 'GET',
                query: '?q=hello&lang=en'
            },
            health: {
                endpoint: '/api/health',
                method: 'GET'
            }
        };
    }

    /**
     * Run comprehensive load test
     */
    async runLoadTest(options = {}) {
        const {
            concurrentUsers = 10,
            duration = 60, // seconds
            rampUp = 10, // seconds
            scenarios = ['translation', 'voice', 'search'],
            targetRPS = 100 // requests per second
        } = options;

        console.log('🏋️ Starting Maya Voice Translator Load Test');
        console.log(`👥 Concurrent Users: ${concurrentUsers}`);
        console.log(`⏱️  Duration: ${duration}s`);
        console.log(`📈 Ramp Up: ${rampUp}s`);
        console.log(`🎯 Target RPS: ${targetRPS}`);
        console.log(`📋 Scenarios: ${scenarios.join(', ')}`);
        console.log('=' .repeat(60));

        this.testResults.startTime = Date.now();

        try {
            // Start system monitoring
            const monitoringInterval = this.startSystemMonitoring();

            // Run load test with multiple workers
            await this.runMultiWorkerTest({
                concurrentUsers,
                duration,
                rampUp,
                scenarios,
                targetRPS
            });

            // Stop monitoring
            clearInterval(monitoringInterval);

            this.testResults.endTime = Date.now();
            this.calculateMetrics();

            // Generate report
            const report = await this.generateReport();
            
            console.log('✅ Load test completed successfully');
            return report;

        } catch (error) {
            console.error('❌ Load test failed:', error);
            throw error;
        }
    }

    /**
     * Run test with multiple worker threads
     */
    async runMultiWorkerTest(options) {
        const { concurrentUsers, duration, rampUp, scenarios } = options;
        const workers = [];
        const usersPerWorker = Math.ceil(concurrentUsers / 4);

        // Create worker threads
        for (let i = 0; i < Math.min(4, concurrentUsers); i++) {
            const worker = new Worker(__filename, {
                workerData: {
                    workerId: i,
                    usersPerWorker: i === 3 ? concurrentUsers - (i * usersPerWorker) : usersPerWorker,
                    duration,
                    rampUp,
                    scenarios,
                    baseUrl: this.baseUrl
                }
            });

            workers.push(worker);

            worker.on('message', (data) => {
                this.aggregateWorkerResults(data);
            });
        }

        // Wait for all workers to complete
        await Promise.all(workers.map(worker => new Promise((resolve) => {
            worker.on('exit', resolve);
        })));
    }

    /**
     * Aggregate results from worker threads
     */
    aggregateWorkerResults(workerResults) {
        this.testResults.totalRequests += workerResults.totalRequests;
        this.testResults.successfulRequests += workerResults.successfulRequests;
        this.testResults.failedRequests += workerResults.failedRequests;
        this.testResults.errors.push(...workerResults.errors);

        // Update response time metrics
        if (workerResults.minResponseTime < this.testResults.minResponseTime) {
            this.testResults.minResponseTime = workerResults.minResponseTime;
        }
        if (workerResults.maxResponseTime > this.testResults.maxResponseTime) {
            this.testResults.maxResponseTime = workerResults.maxResponseTime;
        }
    }

    /**
     * Run stress test to find breaking point
     */
    async runStressTest(options = {}) {
        const {
            startUsers = 10,
            maxUsers = 1000,
            stepSize = 50,
            stepDuration = 30,
            breakPoint = 95 // Success rate threshold
        } = options;

        console.log('💪 Starting Stress Test to find breaking point');
        
        const results = [];
        let currentUsers = startUsers;
        let systemBroken = false;

        while (currentUsers <= maxUsers && !systemBroken) {
            console.log(`🔄 Testing with ${currentUsers} concurrent users...`);
            
            const testResult = await this.runLoadTest({
                concurrentUsers: currentUsers,
                duration: stepDuration,
                rampUp: 5
            });

            results.push({
                users: currentUsers,
                successRate: testResult.successRate,
                avgResponseTime: testResult.averageResponseTime,
                rps: testResult.requestsPerSecond,
                errors: testResult.errors.length
            });

            // Check if system is breaking
            if (testResult.successRate < breakPoint) {
                systemBroken = true;
                console.log(`💥 Breaking point found at ${currentUsers} users`);
                console.log(`📉 Success rate dropped to ${testResult.successRate}%`);
            }

            currentUsers += stepSize;
            
            // Cool down between tests
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        return {
            breakingPoint: systemBroken ? currentUsers - stepSize : maxUsers,
            results: results,
            recommendations: this.generateRecommendations(results)
        };
    }

    /**
     * Start monitoring system resources
     */
    startSystemMonitoring() {
        return setInterval(() => {
            const memUsage = process.memoryUsage();
            const cpuUsage = process.cpuUsage();

            this.testResults.memoryUsage.push({
                timestamp: Date.now(),
                rss: memUsage.rss,
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
                external: memUsage.external
            });

            this.testResults.cpuUsage.push({
                timestamp: Date.now(),
                user: cpuUsage.user,
                system: cpuUsage.system
            });
        }, 1000);
    }

    /**
     * Calculate test metrics
     */
    calculateMetrics() {
        const testDuration = (this.testResults.endTime - this.testResults.startTime) / 1000;
        
        this.testResults.requestsPerSecond = this.testResults.totalRequests / testDuration;
        this.testResults.errorRate = (this.testResults.failedRequests / this.testResults.totalRequests) * 100;
        this.testResults.successRate = 100 - this.testResults.errorRate;
        
        // Calculate average response time (simplified)
        this.testResults.averageResponseTime = this.testResults.totalResponseTime / this.testResults.totalRequests || 0;
    }

    /**
     * Generate performance recommendations
     */
    generateRecommendations(results) {
        const recommendations = [];
        const lastResult = results[results.length - 1];

        if (lastResult.avgResponseTime > 2000) {
            recommendations.push('⚠️ High response times detected. Consider adding caching or optimizing database queries.');
        }

        if (lastResult.successRate < 99) {
            recommendations.push('⚠️ Error rate is high. Check error logs and implement better error handling.');
        }

        if (lastResult.rps < 50) {
            recommendations.push('⚠️ Low throughput. Consider horizontal scaling or performance optimization.');
        }

        // Check for memory leaks
        const memGrowth = this.testResults.memoryUsage;
        if (memGrowth.length > 10) {
            const startMem = memGrowth[0].heapUsed;
            const endMem = memGrowth[memGrowth.length - 1].heapUsed;
            const growthRatio = endMem / startMem;
            
            if (growthRatio > 1.5) {
                recommendations.push('⚠️ Potential memory leak detected. Review code for memory cleanup.');
            }
        }

        return recommendations;
    }

    /**
     * Generate comprehensive test report
     */
    async generateReport() {
        const report = {
            summary: {
                testDuration: (this.testResults.endTime - this.testResults.startTime) / 1000,
                totalRequests: this.testResults.totalRequests,
                successfulRequests: this.testResults.successfulRequests,
                failedRequests: this.testResults.failedRequests,
                successRate: this.testResults.successRate,
                errorRate: this.testResults.errorRate,
                requestsPerSecond: this.testResults.requestsPerSecond,
                averageResponseTime: this.testResults.averageResponseTime,
                minResponseTime: this.testResults.minResponseTime,
                maxResponseTime: this.testResults.maxResponseTime
            },
            performance: {
                memoryUsage: this.testResults.memoryUsage,
                cpuUsage: this.testResults.cpuUsage
            },
            errors: this.testResults.errors,
            recommendations: this.generateRecommendations([this.testResults]),
            timestamp: new Date().toISOString()
        };

        // Save report to file
        const reportPath = path.join(__dirname, 'reports', `performance-report-${Date.now()}.json`);
        
        // Create reports directory if it doesn't exist
        const reportsDir = path.dirname(reportPath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        // Generate HTML report
        await this.generateHTMLReport(report, reportPath.replace('.json', '.html'));

        console.log(`📋 Performance report saved to: ${reportPath}`);
        return report;
    }

    /**
     * Generate HTML report
     */
    async generateHTMLReport(report, filePath) {
        const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maya Voice Translator - Performance Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: linear-gradient(135deg, #0ea5e9, #f3740a); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #0ea5e9; }
        .error { border-left-color: #dc3545; }
        .warning { border-left-color: #ffc107; }
        .success { border-left-color: #28a745; }
        .chart-container { width: 100%; height: 400px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏋️ Maya Voice Translator - Performance Report</h1>
        <p>Generated on: ${report.timestamp}</p>
    </div>

    <h2>📊 Test Summary</h2>
    <div class="metric ${report.summary.successRate > 95 ? 'success' : 'warning'}">
        <strong>Success Rate:</strong> ${report.summary.successRate.toFixed(2)}%
    </div>
    <div class="metric">
        <strong>Total Requests:</strong> ${report.summary.totalRequests}
    </div>
    <div class="metric">
        <strong>Requests per Second:</strong> ${report.summary.requestsPerSecond.toFixed(2)}
    </div>
    <div class="metric ${report.summary.averageResponseTime > 1000 ? 'warning' : 'success'}">
        <strong>Average Response Time:</strong> ${report.summary.averageResponseTime.toFixed(2)}ms
    </div>

    <h2>📈 Performance Charts</h2>
    <div class="chart-container">
        <canvas id="responseTimeChart"></canvas>
    </div>
    <div class="chart-container">
        <canvas id="memoryChart"></canvas>
    </div>

    <h2>⚠️ Recommendations</h2>
    ${report.recommendations.map(rec => `<div class="metric warning">${rec}</div>`).join('')}

    <script>
        // Response Time Chart
        const ctx1 = document.getElementById('responseTimeChart').getContext('2d');
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Min', 'Avg', 'Max'],
                datasets: [{
                    label: 'Response Time (ms)',
                    data: [${report.summary.minResponseTime}, ${report.summary.averageResponseTime}, ${report.summary.maxResponseTime}],
                    borderColor: '#0ea5e9',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Response Time Distribution'
                    }
                }
            }
        });

        // Memory Usage Chart
        const ctx2 = document.getElementById('memoryChart').getContext('2d');
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(report.performance.memoryUsage.map((_, i) => i))},
                datasets: [{
                    label: 'Heap Used (MB)',
                    data: ${JSON.stringify(report.performance.memoryUsage.map(m => m.heapUsed / 1024 / 1024))},
                    borderColor: '#f3740a',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Memory Usage Over Time'
                    }
                }
            }
        });
    </script>
</body>
</html>`;

        fs.writeFileSync(filePath, htmlTemplate);
    }
}

// Worker thread code for load testing
if (!isMainThread) {
    const { workerId, usersPerWorker, duration, scenarios, baseUrl } = workerData;
    
    const worker = new LoadTestWorker(workerId, baseUrl);
    worker.runTest({ usersPerWorker, duration, scenarios })
        .then(results => {
            parentPort.postMessage(results);
            process.exit(0);
        })
        .catch(error => {
            parentPort.postMessage({ error: error.message });
            process.exit(1);
        });
}

class LoadTestWorker {
    constructor(workerId, baseUrl) {
        this.workerId = workerId;
        this.baseUrl = baseUrl;
        this.results = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            totalResponseTime: 0,
            minResponseTime: Infinity,
            maxResponseTime: 0,
            errors: []
        };
    }

    async runTest({ usersPerWorker, duration, scenarios }) {
        const endTime = Date.now() + (duration * 1000);
        const promises = [];

        // Start virtual users
        for (let i = 0; i < usersPerWorker; i++) {
            promises.push(this.runVirtualUser(endTime, scenarios));
        }

        await Promise.all(promises);
        return this.results;
    }

    async runVirtualUser(endTime, scenarios) {
        while (Date.now() < endTime) {
            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            await this.makeRequest(scenario);
            
            // Random delay between requests
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
        }
    }

    async makeRequest(scenarioName) {
        const scenario = {
            translation: {
                endpoint: '/api/translate',
                method: 'POST',
                body: JSON.stringify({
                    text: 'Hello, how are you?',
                    fromLang: 'en',
                    toLang: 'maya-yucateco'
                })
            },
            voice: {
                endpoint: '/api/voice/synthesize',
                method: 'POST',
                body: JSON.stringify({
                    text: 'Ba\'ax ka wa\'alik',
                    language: 'maya-yucateco'
                })
            },
            search: {
                endpoint: '/api/search?q=hello&lang=en',
                method: 'GET'
            },
            health: {
                endpoint: '/api/health',
                method: 'GET'
            }
        }[scenarioName];

        const startTime = Date.now();
        
        try {
            const response = await this.httpRequest(scenario);
            const responseTime = Date.now() - startTime;
            
            this.results.totalRequests++;
            this.results.totalResponseTime += responseTime;
            
            if (response.statusCode >= 200 && response.statusCode < 300) {
                this.results.successfulRequests++;
            } else {
                this.results.failedRequests++;
                this.results.errors.push({
                    scenario: scenarioName,
                    statusCode: response.statusCode,
                    responseTime,
                    timestamp: new Date().toISOString()
                });
            }

            // Update response time metrics
            this.results.minResponseTime = Math.min(this.results.minResponseTime, responseTime);
            this.results.maxResponseTime = Math.max(this.results.maxResponseTime, responseTime);

        } catch (error) {
            this.results.totalRequests++;
            this.results.failedRequests++;
            this.results.errors.push({
                scenario: scenarioName,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    httpRequest(options) {
        return new Promise((resolve, reject) => {
            const url = new URL(options.endpoint, this.baseUrl);
            const isHttps = url.protocol === 'https:';
            const lib = isHttps ? https : http;

            const reqOptions = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: options.method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': `LoadTest-Worker-${this.workerId}`
                }
            };

            const req = lib.request(reqOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                });
            });

            req.on('error', reject);

            if (options.body) {
                req.write(options.body);
            }

            req.end();
        });
    }
}

// Export for testing
module.exports = {
    PerformanceTestingService,
    LoadTestWorker
};

// CLI interface
if (require.main === module) {
    const testService = new PerformanceTestingService();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'load':
            testService.runLoadTest({
                concurrentUsers: parseInt(process.argv[3]) || 10,
                duration: parseInt(process.argv[4]) || 60
            });
            break;
            
        case 'stress':
            testService.runStressTest({
                maxUsers: parseInt(process.argv[3]) || 500
            });
            break;
            
        default:
            console.log(`
🏋️ Maya Voice Translator - Performance Testing

Usage:
  node PerformanceTestingService.js load [users] [duration]
  node PerformanceTestingService.js stress [maxUsers]

Examples:
  node PerformanceTestingService.js load 50 120
  node PerformanceTestingService.js stress 1000
            `);
    }
}
