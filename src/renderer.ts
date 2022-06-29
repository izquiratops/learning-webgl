import { glMatrix, mat4 } from "gl-matrix";
import { FRAGMENT_SOURCE, VERTEX_SOURCE } from "./shaders";
import { Box } from "./box";
import { Buffers, ProgramInfo } from "./renderer.model";

export class Renderer {
    initRenderingContext(gl: WebGLRenderingContext) {
        // Step 1: Run the shader program
        const shaderProgram = this.initShaderProgram(gl, VERTEX_SOURCE, FRAGMENT_SOURCE);

        // Step 2: Attribute + Uniform locations
        const programInfo: ProgramInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(
                    shaderProgram,
                    "uProjectionMatrix"
                ),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            },
        };

        // Step 3: Load buffers
        const buffers = this.initBuffers(gl);

        // Step 4: Draw it
        let then = 0;
        let rotationAmount = 0;

        const render = (now: number) => {
            now *= 0.001; // to seconds
            const deltaTime = now - then;
            then = now;

            rotationAmount = (rotationAmount + deltaTime) % 20;
            this.drawScene(gl, programInfo, buffers, rotationAmount);
            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    private initShaderProgram(
        gl: WebGLRenderingContext,
        vsSource: string,
        fsSource: string
    ): WebGLProgram {
        function _loadShader(
            gl: WebGLRenderingContext,
            type: number,
            source: string
        ): WebGLShader {
            const shader = gl.createShader(type);

            // Send the source to the shader object
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                throw new Error(
                    `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
                        shader
                    )}`
                );
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
            throw new Error(
                `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                    shaderProgram
                )}`
            );
        }

        return shaderProgram;
    }

    private initBuffers(gl: WebGLRenderingContext): Buffers {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Box.vertices), gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Box.colors), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(Box.indices),
            gl.STATIC_DRAW
        );

        return {
            position: positionBuffer,
            color: colorBuffer,
            index: indexBuffer,
        };
    }

    private drawScene(
        gl: WebGLRenderingContext,
        programInfo: ProgramInfo,
        buffers: Buffers,
        rotationAmount: number
    ) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear black
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const setProjectionMatrix = () => {
            const fieldOfView = glMatrix.toRadian(45);
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;

            const projectionMatrix = mat4.create();
            mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

            return projectionMatrix;
        };

        const projectionMatrix = setProjectionMatrix();

        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix, // Destination matrix
            modelViewMatrix, // Matrix to translate
            [0.0, 0.0, -6.0] // Vector to translate by
        );
        mat4.rotate(
            modelViewMatrix, // Destination matrix
            modelViewMatrix, // Matrix to rotate
            rotationAmount, // Amount of rotation (radians)
            [0, 1, 1] // Axis to rotate around
        );

        {
            const buffer = buffers.position;
            const bufferPosition = programInfo.attribLocations.vertexPosition;
            const size = 3;
            const type = gl.FLOAT;
            const normalized = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            gl.vertexAttribPointer(
                bufferPosition,
                size,
                type,
                normalized,
                stride,
                offset
            );

            gl.enableVertexAttribArray(bufferPosition);
        }

        {
            const buffer = buffers.color;
            const bufferPosition = programInfo.attribLocations.vertexColor;
            const size = 4;
            const type = gl.FLOAT;
            const normalized = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            gl.vertexAttribPointer(
                bufferPosition,
                size,
                type,
                normalized,
                stride,
                offset
            );

            gl.enableVertexAttribArray(bufferPosition);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

        gl.useProgram(programInfo.program);

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
            const vertexCount = Box.indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}
