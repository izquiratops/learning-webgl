import { glMatrix, mat4 } from 'gl-matrix';
import { GuiComponent } from '../gui/gui.component';
import { Buffers, ProgramInfo } from './types';
import { Box } from '../objects/box';

export class Renderer {
    private programInfo: ProgramInfo;
    private buffers: Buffers;

    constructor(private gl: WebGL2RenderingContext, private gui: GuiComponent) {}

    initProgram(VERTEX_SOURCE: string, FRAGMENT_SOURCE: string): void {
        const shaderProgram = this.createProgramFromGlsl(
            VERTEX_SOURCE,
            FRAGMENT_SOURCE,
        );

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(
                    shaderProgram,
                    'a_vertex',
                ),
                vertexColor: this.gl.getAttribLocation(
                    shaderProgram,
                    'a_color',
                ),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(
                    shaderProgram,
                    'u_matrix',
                ),
            },
        };
    }

    initBuffers(mesh: Box): void {
        // This way I avoid to get a horde of ugly this.gl everywhere
        const { gl } = this;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(mesh.vertices),
            gl.STATIC_DRAW,
        );

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Uint8Array(mesh.colors),
            gl.STATIC_DRAW,
        );

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(mesh.indices),
            gl.STATIC_DRAW,
        );

        this.buffers = {
            position: positionBuffer,
            color: colorBuffer,
            index: indexBuffer,
        };
    }

    runFrames() {
        const render = () => {
            // Check if canvas has to be resized
            this.resizeCanvasToDisplaySize();

            // Draw scene on canvas
            this.drawScene();

            // Move to the following frame
            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    private drawScene() {
        const { gl, programInfo, buffers } = this;

        gl.clearColor(0, 0, 0, 1); // Clear black
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(programInfo.program);

        const projectionMatrix = ((): mat4 => {
            const fieldOfView = glMatrix.toRadian(90);
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;

            const projectionMatrix = mat4.create();
            mat4.perspective(
                projectionMatrix,
                fieldOfView,
                aspect,
                zNear,
                zFar,
            );

            mat4.translate(
                projectionMatrix,
                projectionMatrix,
                // prettier-ignore
                [0.0, 0.0, -3.0],
            );

            mat4.rotate(
                projectionMatrix,
                projectionMatrix,
                this.gui.rotateCamera,
                [0, 0, 1],
            );

            return projectionMatrix;
        })();

        // Set VERTEX buffer position
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
                offset,
            );

            gl.enableVertexAttribArray(bufferPosition);
        }

        // Set COLOR buffer position
        {
            const buffer = buffers.color;
            const colorPosition = programInfo.attribLocations.vertexColor;
            const size = 4;
            const type = gl.UNSIGNED_BYTE;
            const normalized = true;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            gl.vertexAttribPointer(
                colorPosition,
                size,
                type,
                normalized,
                stride,
                offset,
            );

            gl.enableVertexAttribArray(colorPosition);
        }

        // Set INDICES buffer array
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix,
        );

        {
            const vertexCount = 6 * 6;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    private loadShader(shaderType: GLenum, shaderSource: string): WebGLShader {
        const { gl } = this;

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

    private createProgramFromGlsl(
        vertexSource: string,
        fragmentSource: string,
    ): WebGLProgram {
        const { gl } = this;

        const vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.loadShader(
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

    private resizeCanvasToDisplaySize() {
        const { gl } = this;

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
