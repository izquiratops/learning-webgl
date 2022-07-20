const fs = require('fs');
const esbuild = require('esbuild');

(() => {
    const result = esbuild.buildSync({
        entryPoints: ['./src/main.ts'],
        outdir: 'dist',
        bundle: true,
        minify: false,
        format: 'esm',
        metafile: true,
    });

    const buildReport = esbuild.analyzeMetafileSync(result.metafile);
    console.log('ESBuild report', buildReport);

    fs.copyFileSync('./src/index.html', './dist/index.html');
    fs.copyFileSync('./src/style.css', './dist/style.css');

    fs.copyFileSync(
        './src/gui/gui.component.html',
        './dist/gui.component.html',
    );
    fs.copyFileSync('./src/gui/gui.component.css', './dist/gui.component.css');

    fs.copyFileSync(
        './src/gui/range-input/range-input.component.html',
        './dist/range-input.component.html',
    );
    fs.copyFileSync(
        './src/gui/range-input/range-input.component.css',
        './dist/range-input.component.css',
    );
})();
