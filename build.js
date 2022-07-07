const fs = require('fs');
const esbuild = require('esbuild');

(() => {
    const result = esbuild.buildSync({
        entryPoints: ['./src/main.ts'],
        outdir: 'dist',
        bundle: true,
        minify: true,
        format: 'esm',
        metafile: true,
    });

    const buildReport = esbuild.analyzeMetafileSync(result.metafile);
    console.log('ESBuild report', buildReport);

    fs.copyFileSync('./src/index.html', './dist/index.html');
    fs.copyFileSync('./src/style.css', './dist/style.css');
})();
