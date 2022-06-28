// Gets rid of comments
// \/\*(\*(?!\/) | [^*])*\*\/  --> /* detect multi-line comment */
// (?:\/\/).*                  --> // detect comments until end of line
const comments = new RegExp(
    '\\/\\*(\\*(?!\\/)|[^*])*\\*\\/|(\\/\\/).*',
    'gm'
);

export const VERTEX_SOURCE = `
    attribute vec4 aVertexPosition;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`.replace(comments, '');

export const FRAGMENT_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`.replace(comments, '');
