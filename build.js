const esbuild = require('esbuild');
const fs = require('fs');
const path = require("path");

const copyRecursiveSync = (src, dest) => {
    // Check if exists and it's a directory
    const isDirectory = fs.existsSync(src) && fs.statSync(src).isDirectory();

    // If: it's a directory then we look inside
    // Else: copy file into 'dest'
    if (isDirectory) {
        // Create dest folder if it's not already done
        if (!fs.existsSync(dest)) { fs.mkdirSync(dest); }

        // Look for every item inside for recursive folders
        fs.readdirSync(src)
            .filter(file => !file.match(/.js|.jsx|.ts|.tsx/))
            .forEach((dir) => {
                const childSrc = path.join(src, dir);
                const childDest = path.join(dest, dir);
                copyRecursiveSync(childSrc, childDest);
            })
    } else {
        fs.copyFileSync(src, dest);
    }
}

esbuild.build({
        entryPoints: ['src/main.ts'],
        bundle: true,
        minify: false,
        sourcemap: true,
        watch: true,
        outdir: 'dist'
    })
    .then(_ => copyRecursiveSync('./src', './dist'))
    .catch(() => process.exit(1));