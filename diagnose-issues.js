#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 SHENNA\'S STUDIO - COMPREHENSIVE ISSUE DIAGNOSIS\n');
console.log('='.repeat(60));

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function logSection(title) {
    console.log(`\n${colors.cyan}${colors.bold}📋 ${title}${colors.reset}`);
    console.log('-'.repeat(50));
}

function logError(message) {
    console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
    console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logSuccess(message) {
    console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logInfo(message) {
    console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

async function checkPackageJson(filePath, projectName) {
    logSection(`${projectName} Package Analysis`);
    
    if (!fs.existsSync(filePath)) {
        logError(`package.json not found at ${filePath}`);
        return [];
    }

    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const issues = [];

    // Check for deprecated packages
    const deprecatedPackages = {
        'inflight': 'Use lru-cache instead',
        '@oclif/command': 'Deprecated - use @oclif/core',
        '@oclif/config': 'Deprecated - use @oclif/core',
        '@oclif/errors': 'Deprecated - use @oclif/core',
        '@oclif/parser': 'Deprecated - use @oclif/core',
        '@oclif/help': 'Deprecated - use @oclif/core',
        '@oclif/screen': 'Deprecated - use @oclif/core',
        'cli-ux': 'Deprecated - use @oclif/core',
        'multer': 'Version 1.x has vulnerabilities - upgrade to 2.x',
        'glob': 'Versions prior to v9 deprecated',
        'algolia': 'Empty package - use algoliasearch'
    };

    // Check dependencies
    const allDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
    };

    let deprecatedCount = 0;
    for (const [pkg, reason] of Object.entries(deprecatedPackages)) {
        if (allDeps[pkg]) {
            logWarning(`${pkg}: ${reason}`);
            issues.push(`Deprecated: ${pkg} - ${reason}`);
            deprecatedCount++;
        }
    }

    // Check for version conflicts
    if (packageJson.overrides) {
        logInfo(`Found ${Object.keys(packageJson.overrides).length} package overrides`);
        Object.entries(packageJson.overrides).forEach(([pkg, version]) => {
            if (allDeps[pkg] && allDeps[pkg] !== version) {
                logWarning(`Version conflict: ${pkg} (${allDeps[pkg]} vs override ${version})`);
                issues.push(`Version conflict: ${pkg}`);
            }
        });
    }

    logInfo(`Total dependencies: ${Object.keys(allDeps).length}`);
    if (deprecatedCount > 0) {
        logError(`Found ${deprecatedCount} deprecated packages`);
    } else {
        logSuccess('No known deprecated packages found');
    }

    return issues;
}

async function runAudit(projectPath, projectName) {
    logSection(`${projectName} Security Audit`);
    
    try {
        const auditOutput = execSync('npm audit --json', { 
            cwd: projectPath, 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        const audit = JSON.parse(auditOutput);
        
        if (audit.metadata) {
            const { vulnerabilities } = audit.metadata;
            const total = vulnerabilities.total || 0;
            
            if (total > 0) {
                logError(`Found ${total} vulnerabilities:`);
                if (vulnerabilities.critical) logError(`  Critical: ${vulnerabilities.critical}`);
                if (vulnerabilities.high) logError(`  High: ${vulnerabilities.high}`);
                if (vulnerabilities.moderate) logWarning(`  Moderate: ${vulnerabilities.moderate}`);
                if (vulnerabilities.low) logInfo(`  Low: ${vulnerabilities.low}`);
                if (vulnerabilities.info) logInfo(`  Info: ${vulnerabilities.info}`);
                
                return total;
            } else {
                logSuccess('No vulnerabilities found');
                return 0;
            }
        }
    } catch (error) {
        if (error.stdout) {
            try {
                const audit = JSON.parse(error.stdout);
                if (audit.metadata && audit.metadata.vulnerabilities) {
                    const { vulnerabilities } = audit.metadata;
                    const total = vulnerabilities.total || 0;
                    if (total > 0) {
                        logError(`Found ${total} vulnerabilities (with fixes available)`);
                        return total;
                    }
                }
            } catch (parseError) {
                logWarning('Could not parse audit output');
            }
        }
        logWarning(`Audit failed: ${error.message.split('\n')[0]}`);
        return -1;
    }
    
    return 0;
}

async function checkOutdatedPackages(projectPath, projectName) {
    logSection(`${projectName} Outdated Packages`);
    
    try {
        const outdatedOutput = execSync('npm outdated --json', { 
            cwd: projectPath, 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        if (outdatedOutput.trim()) {
            const outdated = JSON.parse(outdatedOutput);
            const packages = Object.keys(outdated);
            
            if (packages.length > 0) {
                logWarning(`Found ${packages.length} outdated packages:`);
                packages.forEach(pkg => {
                    const info = outdated[pkg];
                    console.log(`  ${pkg}: ${info.current} → ${info.wanted} (latest: ${info.latest})`);
                });
                return packages.length;
            } else {
                logSuccess('All packages are up to date');
                return 0;
            }
        } else {
            logSuccess('All packages are up to date');
            return 0;
        }
    } catch (error) {
        // npm outdated exits with code 1 when outdated packages are found
        if (error.stdout) {
            try {
                const outdated = JSON.parse(error.stdout);
                const packages = Object.keys(outdated);
                if (packages.length > 0) {
                    logWarning(`Found ${packages.length} outdated packages:`);
                    packages.forEach(pkg => {
                        const info = outdated[pkg];
                        console.log(`  ${pkg}: ${info.current} → ${info.wanted} (latest: ${info.latest})`);
                    });
                    return packages.length;
                }
            } catch (parseError) {
                // If we can't parse, just show raw output
                if (error.stdout.trim()) {
                    logInfo('Outdated packages found (raw output):');
                    console.log(error.stdout);
                    return 1;
                }
            }
        }
        return 0;
    }
}

async function checkNodeVersion() {
    logSection('Node.js Version Check');
    
    try {
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
        
        logInfo(`Current Node.js version: ${nodeVersion}`);
        
        if (majorVersion < 18) {
            logError('Node.js version is too old. Minimum required: v18');
            return false;
        } else if (majorVersion >= 20) {
            logSuccess('Node.js version is current');
            return true;
        } else {
            logWarning('Node.js version is supported but consider upgrading to v20+');
            return true;
        }
    } catch (error) {
        logError(`Could not check Node.js version: ${error.message}`);
        return false;
    }
}

async function checkProjectStructure() {
    logSection('Project Structure Check');
    
    const expectedFiles = [
        'package.json',
        'next.config.ts',
        'tailwind.config.ts',
        'tsconfig.json',
        'app',
        'ocean-backend',
        'docker-compose.yml'
    ];
    
    let issues = 0;
    expectedFiles.forEach(file => {
        if (fs.existsSync(file)) {
            logSuccess(`Found: ${file}`);
        } else {
            logError(`Missing: ${file}`);
            issues++;
        }
    });
    
    return issues;
}

async function main() {
    try {
        console.log(`${colors.blue}Starting comprehensive diagnosis...${colors.reset}\n`);
        
        let totalIssues = 0;
        let totalVulns = 0;
        
        // Check Node.js version
        const nodeOk = await checkNodeVersion();
        if (!nodeOk) totalIssues++;
        
        // Check project structure
        const structureIssues = await checkProjectStructure();
        totalIssues += structureIssues;
        
        // Analyze frontend
        const frontendIssues = await checkPackageJson('./package.json', 'Frontend');
        totalIssues += frontendIssues.length;
        
        // Analyze backend
        const backendIssues = await checkPackageJson('./ocean-backend/package.json', 'Backend');
        totalIssues += backendIssues.length;
        
        // Security audits
        if (fs.existsSync('./node_modules')) {
            const frontendVulns = await runAudit('.', 'Frontend');
            if (frontendVulns > 0) totalVulns += frontendVulns;
        }
        
        if (fs.existsSync('./ocean-backend/node_modules')) {
            const backendVulns = await runAudit('./ocean-backend', 'Backend');
            if (backendVulns > 0) totalVulns += backendVulns;
        }
        
        // Check outdated packages
        if (fs.existsSync('./node_modules')) {
            const frontendOutdated = await checkOutdatedPackages('.', 'Frontend');
            totalIssues += frontendOutdated;
        }
        
        if (fs.existsSync('./ocean-backend/node_modules')) {
            const backendOutdated = await checkOutdatedPackages('./ocean-backend', 'Backend');
            totalIssues += backendOutdated;
        }
        
        // Summary
        logSection('DIAGNOSIS SUMMARY');
        console.log(`${colors.bold}Total Issues Found: ${totalIssues}${colors.reset}`);
        console.log(`${colors.bold}Security Vulnerabilities: ${totalVulns}${colors.reset}`);
        
        if (totalIssues === 0 && totalVulns === 0) {
            logSuccess('🎉 No major issues found! Your application is in good shape.');
        } else if (totalIssues > 10 || totalVulns > 5) {
            logError('🚨 Critical: Many issues found. Immediate attention required.');
        } else {
            logWarning('⚠️  Some issues found. Recommend addressing them soon.');
        }
        
        console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
        console.log('1. Run "npm audit fix" to auto-fix vulnerabilities');
        console.log('2. Update deprecated packages to modern alternatives');
        console.log('3. Update outdated packages to latest versions');
        console.log('4. Test application after updates');
        
    } catch (error) {
        logError(`Diagnosis failed: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}