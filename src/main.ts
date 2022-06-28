import {Renderer} from "./renderer";
import {VERTEX_SOURCE, FRAGMENT_SOURCE} from "./shaders";

export interface ProgramInfo {
    program: WebGLProgram,
    attribLocations: {
        vertexPosition: number
    },
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation,
        modelViewMatrix: WebGLUniformLocation
    }
}

function main() {
    const canvas: HTMLCanvasElement = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");

    if (gl === null) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    const renderer = new Renderer();

    // Step 1: Run the shader program
    const shaderProgram = renderer.initShaderProgram(gl, VERTEX_SOURCE, FRAGMENT_SOURCE);

    // Step 2: Attribute + Uniform locations
    const programInfo: ProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
        }
    }

    // Step 3: Load buffers
    const buffers = renderer.initBuffers(gl);

    // Step 4: Draw it
    renderer.drawScene(gl, programInfo, buffers);
}

window.onload = main;