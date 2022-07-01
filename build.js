const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const copyRecursiveSync = (src, dest) => {
    const isDirectory = fs.existsSync(src) && fs.statSync(src).isDirectory();

    if (isDirectory) {
        // Create dest folder if it's not already done
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        // Look for every item inside for recursive folders
        fs.readdirSync(src)
            .filter((file) => !file.match(/.js|.jsx|.ts|.tsx/))
            .forEach((dir) => {
                const childSrc = path.join(src, dir);
                const childDest = path.join(dest, dir);
                copyRecursiveSync(childSrc, childDest);
            });
    } else {
        fs.copyFileSync(src, dest);
    }
};

(async () => {
    const result = await esbuild.build({
        entryPoints: ['src/main.ts'],
        outdir: 'dist',
        bundle: true,
        minify: true,
        metafile: true,
    });

    const buildReport = await esbuild.analyzeMetafile(result.metafile);
    console.log('ESBuild report', buildReport);

    copyRecursiveSync('./src', './dist');
})();
