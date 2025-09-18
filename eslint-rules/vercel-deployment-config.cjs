/**
 * ESLint rule: vercel-deployment-config
 * Validates that Vercel deployment configuration is correct for monorepo apps
 */

const fs = require('fs');
const path = require('path');

const vercelDeploymentConfig = {
  rules: {
    'validate-config': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure Vercel deployment configuration is correct for monorepo apps',
          category: 'Possible Errors',
          recommended: true,
        },
        fixable: 'code',
        schema: [],
        messages: {
          missingVercelJson: 'vercel.json is required in the root directory for monorepo deployment',
          incorrectInstallCommand: 'vercel.json must use "pnpm install" for workspace dependencies',
          incorrectBuildCommand: 'vercel.json must use "pnpm -w build --filter" for monorepo builds',
          incorrectOutputDirectory: 'vercel.json outputDirectory should be ".next" when Root Directory is set to apps/web-app',
          incorrectFramework: 'vercel.json framework should be "nextjs" for Next.js applications',
          missingWorkspaceFile: 'pnpm-workspace.yaml is required for pnpm monorepo configuration',
          incorrectPackageManager: 'package.json must specify "packageManager": "pnpm@9.0.0" for consistent deployments',
        },
      },

      create(context) {
        function checkVercelConfig() {
          const rootDir = process.cwd();
          const vercelJsonPath = path.join(rootDir, 'vercel.json');
          const packageJsonPath = path.join(rootDir, 'package.json');
          const workspacePath = path.join(rootDir, 'pnpm-workspace.yaml');

          // Check if vercel.json exists
          if (!fs.existsSync(vercelJsonPath)) {
            return {
              message: 'missingVercelJson',
              line: 1,
              column: 1,
            };
          }

          // Check if pnpm-workspace.yaml exists
          if (!fs.existsSync(workspacePath)) {
            return {
              message: 'missingWorkspaceFile',
              line: 1,
              column: 1,
            };
          }

          try {
            // Validate vercel.json content
            const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

            const errors = [];

            // Check installCommand
            if (vercelConfig.installCommand !== 'pnpm install') {
              errors.push({
                message: 'incorrectInstallCommand',
                line: 1,
                column: 1,
                fix: {
                  installCommand: 'pnpm install'
                }
              });
            }

            // Check buildCommand for monorepo pattern
            if (!vercelConfig.buildCommand || !vercelConfig.buildCommand.includes('pnpm -w build --filter')) {
              errors.push({
                message: 'incorrectBuildCommand',
                line: 1,
                column: 1,
                fix: {
                  buildCommand: 'pnpm -w build --filter @autamedica/web-app...'
                }
              });
            }

            // Check outputDirectory
            if (vercelConfig.outputDirectory !== '.next') {
              errors.push({
                message: 'incorrectOutputDirectory',
                line: 1,
                column: 1,
                fix: {
                  outputDirectory: '.next'
                }
              });
            }

            // Check framework
            if (vercelConfig.framework !== 'nextjs') {
              errors.push({
                message: 'incorrectFramework',
                line: 1,
                column: 1,
                fix: {
                  framework: 'nextjs'
                }
              });
            }

            // Check package manager in package.json
            if (!packageJson.packageManager || !packageJson.packageManager.startsWith('pnpm@')) {
              errors.push({
                message: 'incorrectPackageManager',
                line: 1,
                column: 1,
                fix: {
                  packageManager: 'pnpm@9.0.0'
                }
              });
            }

            return errors.length > 0 ? errors[0] : null;

          } catch (error) {
            return {
              message: 'missingVercelJson',
              line: 1,
              column: 1,
            };
          }
        }

        return {
          Program(node) {
            // Only run this check on the main entry file or package.json
            const filename = context.getFilename();
            if (filename.includes('package.json') || filename.includes('app/page.tsx') || filename.includes('src/app/page.tsx')) {
              const error = checkVercelConfig();
              if (error) {
                context.report({
                  node,
                  messageId: error.message,
                  fix(fixer) {
                    // Auto-fix capabilities would require more complex logic
                    // For now, just report the error
                    return null;
                  }
                });
              }
            }
          },
        };
      },
    },
  },
};

module.exports = vercelDeploymentConfig;