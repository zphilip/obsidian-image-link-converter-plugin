const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'main.js',
  format: 'cjs',
  platform: 'node',
  external: ['obsidian'],
  sourcemap: 'inline',
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
})
.then(() => {
  console.log('Build succeeded!');
})
.catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});