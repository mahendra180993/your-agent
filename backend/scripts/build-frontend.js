// Build script to build frontend before starting backend
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Building frontend for production...');

try {
  // Change to frontend directory
  const frontendDir = path.join(__dirname, '../../frontend');
  
  if (!fs.existsSync(frontendDir)) {
    console.log('⚠️  Frontend directory not found, skipping frontend build');
    process.exit(0);
  }
  
  process.chdir(frontendDir);
  
  // Check if node_modules exists, if not install
  if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
    console.log('📦 Installing frontend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Build frontend
  console.log('🏗️  Building frontend for production...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Frontend built successfully!');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  console.error('⚠️  Backend will start without frontend. Build frontend manually if needed.');
  // Don't exit with error - allow backend to start without frontend
  process.exit(0);
}
