/**
 * ESLint rules for Vercel deployment validation
 */

module.exports = {
  rules: {
    'vercel-deployment/valid-config': {
      create(context) {
        return {
          Program(node) {
            const filename = context.getFilename();
            
            // Only check vercel.json files
            if (!filename.endsWith('vercel.json')) return;
            
            const sourceCode = context.getSourceCode();
            const text = sourceCode.getText();
            
            try {
              const config = JSON.parse(text);
              
              // Required fields
              const requiredFields = ['installCommand', 'buildCommand', 'outputDirectory', 'framework'];
              requiredFields.forEach(field => {
                if (!config[field]) {
                  context.report({
                    node,
                    message: `Missing required field: ${field}`,
                  });
                }
              });
              
              // Validate installCommand includes corepack
              if (config.installCommand && !config.installCommand.includes('corepack')) {
                context.report({
                  node,
                  message: 'installCommand must include corepack for pnpm@9.15.2',
                });
              }
              
              // Validate buildCommand includes filter
              if (config.buildCommand && !config.buildCommand.includes('--filter')) {
                context.report({
                  node,
                  message: 'buildCommand should include --filter for monorepo builds',
                });
              }
              
              // Validate outputDirectory
              if (config.outputDirectory && config.outputDirectory !== '.next') {
                context.report({
                  node,
                  message: 'outputDirectory should be ".next" for Next.js apps',
                  severity: 1, // warning
                });
              }
              
              // Validate framework
              if (config.framework && config.framework !== 'nextjs') {
                context.report({
                  node,
                  message: 'framework should be "nextjs" for Next.js apps',
                });
              }
              
            } catch (error) {
              context.report({
                node,
                message: `Invalid JSON in vercel.json: ${error.message}`,
              });
            }
          },
        };
      },
    },
    
    'vercel-deployment/package-manager': {
      create(context) {
        return {
          Program(node) {
            const filename = context.getFilename();
            
            // Only check package.json files
            if (!filename.endsWith('package.json')) return;
            
            const sourceCode = context.getSourceCode();
            const text = sourceCode.getText();
            
            try {
              const pkg = JSON.parse(text);
              
              // Check root package.json
              if (filename.includes('/altamedica-reboot/package.json')) {
                if (pkg.packageManager !== 'pnpm@9.15.2') {
                  context.report({
                    node,
                    message: 'Root package.json must have packageManager: "pnpm@9.15.2"',
                  });
                }
              }
              
              // Check app package.json files
              if (filename.includes('/apps/')) {
                // Must have Next.js in dependencies
                const hasNext = (pkg.dependencies && pkg.dependencies.next) || 
                               (pkg.devDependencies && pkg.devDependencies.next);
                
                if (!hasNext) {
                  context.report({
                    node,
                    message: 'App package.json must include "next" in dependencies',
                  });
                }
                
                // Should not have engines.pnpm (causes conflicts)
                if (pkg.engines && pkg.engines.pnpm) {
                  context.report({
                    node,
                    message: 'Remove engines.pnpm to prevent Vercel auto-detection conflicts',
                    severity: 1, // warning
                  });
                }
              }
              
            } catch (error) {
              // Not a valid JSON, skip
            }
          },
        };
      },
    },
    
    'vercel-deployment/env-variables': {
      create(context) {
        return {
          Program(node) {
            const filename = context.getFilename();
            
            // Check .env.example files
            if (!filename.endsWith('.env.example')) return;
            
            const sourceCode = context.getSourceCode();
            const text = sourceCode.getText();
            
            const requiredVars = [
              'NEXT_PUBLIC_SUPABASE_URL',
              'NEXT_PUBLIC_SUPABASE_ANON_KEY',
              'NEXT_PUBLIC_APP_NAME',
            ];
            
            requiredVars.forEach(varName => {
              if (!text.includes(varName)) {
                context.report({
                  node,
                  message: `Missing required environment variable: ${varName}`,
                  severity: 1, // warning
                });
              }
            });
            
            // Check for Vercel-specific vars
            const vercelVars = [
              'ENABLE_EXPERIMENTAL_COREPACK',
              'NPM_CONFIG_REGISTRY',
              'PNPM_NETWORK_CONCURRENCY',
              'PNPM_FETCH_RETRIES',
            ];
            
            vercelVars.forEach(varName => {
              if (!text.includes(varName)) {
                context.report({
                  node,
                  message: `Consider adding Vercel optimization variable: ${varName}`,
                  severity: 1, // warning
                });
              }
            });
          },
        };
      },
    },
  },
};