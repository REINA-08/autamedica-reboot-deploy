#!/bin/bash

# Setup staging environment for AltaMedica
set -e

echo "🔧 Setting up staging environment..."

# Link to staging project
cd /root/altamedica-reboot

# Deploy staging branch to staging project
echo "📤 Deploying staging branch to staging project..."
vercel deploy --target=staging --scope=reina08s-projects

echo "✅ Staging environment setup complete!"