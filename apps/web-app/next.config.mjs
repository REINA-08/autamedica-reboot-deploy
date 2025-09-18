/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@autamedica/types",
    "@autamedica/shared",
    "@autamedica/auth",
    "@autamedica/hooks"
  ],
  experimental: {
    // Enable turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },

  // Security headers for HIPAA compliance and web security
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isStaging = process.env.NODE_ENV === 'staging';
    const isProduction = process.env.NODE_ENV === 'production';

    // Content Security Policy - strict for healthcare data
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' blob:",
      "connect-src 'self' https://*.supabase.co https://*.supabase.io https://api.autamedica.com https://*.sentry.io wss://*.supabase.co",
      "frame-src 'self' https://www.google.com https://vercel.live",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "manifest-src 'self'"
    ];

    // Relax CSP for development
    if (isDevelopment) {
      cspDirectives[1] = "script-src 'self' 'unsafe-eval' 'unsafe-inline' *";
      cspDirectives[4] = "connect-src 'self' http://localhost:* ws://localhost:* https://*.supabase.co https://*.sentry.io wss://*.supabase.co";
    }

    const securityHeaders = [
      // Content Security Policy for XSS protection
      {
        key: 'Content-Security-Policy',
        value: cspDirectives.join('; ')
      },
      // HIPAA Compliance Headers
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'off'
      },
      // Medical data protection
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
      },
      // Cache control for sensitive data
      {
        key: 'Cache-Control',
        value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
      },
      // Custom security headers
      {
        key: 'X-Robots-Tag',
        value: isProduction ? 'index, follow' : 'noindex, nofollow'
      },
      {
        key: 'X-Medical-Data-Protection',
        value: 'HIPAA-Compliant'
      }
    ];

    // Add development-specific headers
    if (isDevelopment) {
      securityHeaders.push({
        key: 'X-Development-Mode',
        value: 'true'
      });
    }

    // Add staging-specific headers
    if (isStaging) {
      securityHeaders.push({
        key: 'X-Staging-Environment',
        value: 'true'
      });
    }

    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders
      },
      {
        // Extra strict headers for API routes with medical data
        source: '/api/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'X-API-Medical-Data',
            value: 'Protected'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL || 'https://autamedica.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          }
        ]
      }
    ];
  },

  // Redirects for SEO and routing
  async redirects() {
    return [
      // Redirect www to non-www for production
      ...(process.env.NODE_ENV === 'production' ? [{
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.autamedica.com'
          }
        ],
        destination: 'https://autamedica.com/:path*',
        permanent: true
      }] : []),
      // Health check endpoint
      {
        source: '/health',
        destination: '/api/health',
        permanent: false
      }
    ];
  },

  // Image optimization for medical images
  images: {
    domains: [
      'autamedica.com',
      'staging.autamedica.com',
      'localhost',
      'hfadsjmdmfqzvtgnqsqr.supabase.co' // Supabase storage
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: false, // Security: no SVG uploads
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
};

export default nextConfig;