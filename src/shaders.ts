// Gets rid of comments
// \/\*(\*(?!\/) | [^*])*\*\/  --> /* detect multi-line comment */
// (?:\/\/).*                  --> // detect comments until end of line
const comments = new RegExp('\\/\\*(\\*(?!\\/)|[^*])*\\*\\/|(\\/\\/).*', 'gm');

export const VERTEX_SOURCE = `#version 300 es
    in vec4 aVertexPosition;
    in vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    out lowp vec4 vColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`.replace(comments, '');

export const FRAGMENT_SOURCE = `#version 300 es
    precision highp float;

    in lowp vec4 vColor;
    
    out vec4 outColor;

    void main(void) {
        outColor = vColor;
    }
`.replace(comments, '');
