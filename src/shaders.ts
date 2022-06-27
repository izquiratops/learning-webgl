const vertex = `
    attribute vec4 aVertexPosition;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

const fragment = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

// Gets rid of comments
// \/\*(\*(?!\/) | [^*])*\*\/  --> /* detect multi-line comment */
// (?:\/\/).*                  --> // detect comments until end of line
const comments = new RegExp(
    '\\/\\*(\\*(?!\\/)|[^*])*\\*\\/|(\\/\\/).*',
    'gm'
);

const getRidOfComments = function ([key, source]: [string, string]) {
    return { [key]: source.replace(comments, '') }
}

export const shaders = Object.assign({}, ...Object.entries({ vertex, fragment })
    .map(getRidOfComments));