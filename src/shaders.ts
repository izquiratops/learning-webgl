// Gets rid of comments
// \/\*(\*(?!\/) | [^*])*\*\/  --> /* detect multi-line comment */
// (?:\/\/).*                  --> // detect comments until end of line
const comments = new RegExp("\\/\\*(\\*(?!\\/)|[^*])*\\*\\/|(\\/\\/).*", "gm");

export const VERTEX_SOURCE = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`.replace(comments, "");

export const FRAGMENT_SOURCE = `
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`.replace(comments, "");
