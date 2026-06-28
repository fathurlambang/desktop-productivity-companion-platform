const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

// Packages to remove (dev dependencies that shouldn't be in the build)
const packagesToRemove = [
  'electron',
  'app-builder-bin',
  'app-builder-lib',
  'builder-util',
  'builder-util-runtime',
  'typescript',
  'vite',
  '@vitejs',
  'playwright',
  'playwright-core',
  '7zip-bin',
  '@esbuild',
  '@esbuild-kit',
  'esbuild',
  'prettier',
  'drizzle-kit',
  '@typescript-eslint',
  'tailwindcss',
  'autoprefixer',
  'postcss',
  'jsdom',
  '@testing-library',
  'globals',
  'vitest',
  '@playwright',
  'eslint',
  'eslint-plugin-react-hooks',
  'eslint-plugin-react-refresh',
  '@babel',
  'rollup',
  'node-gyp',
  'prebuild-install',
  'node-abi',
  'detect-libc',
  'napi-build-utils',
  'expand-template',
  'github-from-package',
  'simple-get',
  'tar-fs',
  'tunnel-agent',
  'rc',
  'deep-extend',
  'ini',
  'minimist',
  'argparse',
  'js-yaml',
  'sax',
];

// File extensions to remove
const extensionsToRemove = ['.md', '.txt', '.map', '.yml', '.yaml'];

console.log('Cleaning node_modules for production build...');

// Remove specified packages
for (const pkg of packagesToRemove) {
  const pkgPath = path.join(nodeModulesPath, pkg);
  if (fs.existsSync(pkgPath)) {
    fs.rmSync(pkgPath, { recursive: true, force: true });
    console.log(`Removed: ${pkg}`);
  }
}

// Remove unnecessary files recursively
function cleanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip .bin and .cache directories
      if (entry.name === '.bin' || entry.name === '.cache') {
        fs.rmSync(fullPath, { recursive: true, force: true });
        continue;
      }
      cleanDirectory(fullPath);
    } else {
      // Remove files with specified extensions
      const ext = path.extname(entry.name).toLowerCase();
      if (extensionsToRemove.includes(ext)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {}
      }
      
      // Remove README, LICENSE, CHANGELOG files
      const name = entry.name.toUpperCase();
      if (name.startsWith('README') || name.startsWith('LICENSE') || name.startsWith('CHANGELOG')) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {}
      }
    }
  }
}

cleanDirectory(nodeModulesPath);

console.log('Cleaning complete!');
