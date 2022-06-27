import {glMatrix, mat4} from "gl-matrix";
import {ProgramInfo} from "./main";

export interface Buffers {
    position: WebGLBuffer
}

export class Renderer {

    constructor() {
    }

    initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {
        function _loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
            const shader = gl.createShader(type);

            // Send the source to the shader object
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
            }

            return shader;
        }

        const vertexShader = _loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = _loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Completes the process of preparing the GPU code for the shaders.
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        }

        return shaderProgram;
    }

    initBuffers(gl: WebGLRenderingContext): Buffers {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions = [
            +1.0, +1.0,
            -1.0, +1.0,
            +1.0, -1.0,
            -1.0, -1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        return {position: positionBuffer};
    }

    drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear black
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Perspective matrix with a FOV of 45 degrees
        const fieldOfView = glMatrix.toRadian(45);
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;

        // mat4 Module from glmatrix.js
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        // Center of scene
        const modelViewMatrix = mat4.create();

        // ------- ! Drawing the square ! -------
        mat4.translate(
            modelViewMatrix, // Destination matrix
            modelViewMatrix, // Matrix to translate
            [0.0, 0.0, -6.0] // Amount to translate
        );

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );

            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition
            );
        }

        gl.useProgram(programInfo.program);

        // Set shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );

        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
}