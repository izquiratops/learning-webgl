// Gets rid of comments
// \/\*(\*(?!\/) | [^*])*\*\/  --> /* detect multi-line comment */
// (?:\/\/).*                  --> // detect comments until end of line
const comments = new RegExp('\\/\\*(\\*(?!\\/)|[^*])*\\*\\/|(\\/\\/).*', 'gm');

export const VERTEX_SOURCE = `#version 300 es
    in vec4 a_vertex;
    in vec4 a_color;

    uniform mat4 u_matrix;

    out lowp vec4 v_color;

    void main() {
        gl_Position = u_matrix * a_vertex;
        v_color = a_color;
    }
`.replace(comments, '');

export const FRAGMENT_SOURCE = `#version 300 es
    precision highp float;

    in lowp vec4 v_color;
    
    out vec4 outColor;

    void main(void) {
        outColor = v_color;
    }
`.replace(comments, '');
