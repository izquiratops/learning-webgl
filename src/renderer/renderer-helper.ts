export class RendererHelper {
    static loadShader(
        gl: WebGLRenderingContext,
        shaderType: GLenum,
        shaderSource: string,
    ): WebGLShader {
        const shader = gl.createShader(shaderType);

        // Load the shader source
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            gl.deleteShader(shader);
            throw new Error(
                `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
                    shader,
                )}`,
            );
        }

        return shader;
    }

    static createProgram(
        gl: WebGLRenderingContext,
        vertexSource: string,
        fragmentSource: string,
    ): WebGLProgram {
        const vertexShader = RendererHelper.loadShader(
            gl,
            gl.VERTEX_SHADER,
            vertexSource,
        );
        const fragmentShader = RendererHelper.loadShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentSource,
        );

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Completes the process of preparing the GPU code for the shaders.
        gl.linkProgram(shaderProgram);

        const linked = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
        if (!linked) {
            gl.deleteProgram(shaderProgram);
            throw new Error(
                `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                    shaderProgram,
                )}`,
            );
        }

        return shaderProgram;
    }

    static resizeCanvasToDisplaySize(gl: WebGLRenderingContext) {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth = gl.canvas.clientWidth;
        const displayHeight = gl.canvas.clientHeight;

        // Check if the canvas is not the same size.
        const needResize =
            gl.canvas.width !== displayWidth ||
            gl.canvas.height !== displayHeight;

        if (needResize) {
            // Make the canvas the same size
            gl.canvas.width = displayWidth;
            gl.canvas.height = displayHeight;

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
    }
}
