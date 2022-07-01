import { glMatrix, mat4 } from 'gl-matrix';
import { Buffers, ProgramInfo } from './renderer.model';
import { RendererHelper } from './renderer-helper';

// Imported scene data
import { FRAGMENT_SOURCE, VERTEX_SOURCE } from './shaders';
import { BoxObject } from './box-object';

export class Renderer {
    constructor(gl: WebGLRenderingContext) {
        this.init(gl);
    }

    private init(gl: WebGLRenderingContext) {
        const shaderProgram = RendererHelper.createProgram(
            gl,
            VERTEX_SOURCE,
            FRAGMENT_SOURCE,
        );

        const programInfo: ProgramInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(
                    shaderProgram,
                    'aVertexPosition',
                ),
                vertexColor: gl.getAttribLocation(
                    shaderProgram,
                    'aVertexColor',
                ),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(
                    shaderProgram,
                    'uProjectionMatrix',
                ),
                modelViewMatrix: gl.getUniformLocation(
                    shaderProgram,
                    'uModelViewMatrix',
                ),
            },
        };

        const buffers = this.initBuffers(gl);

        let then = 0;
        let animationStep = 0;

        const renderFrame = (now: DOMHighResTimeStamp) => {
            now *= 0.001; // to seconds
            animationStep = (animationStep + (now - then)) % (2 * Math.PI);
            then = now;

            RendererHelper.resizeCanvasToDisplaySize(gl);
            this.drawScene(gl, programInfo, buffers, animationStep);
            requestAnimationFrame(renderFrame);
        };

        requestAnimationFrame(renderFrame);
    }

    private initBuffers(gl: WebGLRenderingContext): Buffers {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(BoxObject.vertices),
            gl.STATIC_DRAW,
        );

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(BoxObject.colors),
            gl.STATIC_DRAW,
        );

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(BoxObject.indices),
            gl.STATIC_DRAW,
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
        animationIndex: number,
    ) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear black
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(programInfo.program);

        const _setProjectionMatrix = (): mat4 => {
            const fieldOfView = glMatrix.toRadian(45);
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

            return projectionMatrix;
        };

        const _setModelViewMatrix = (): mat4 => {
            const modelViewMatrix = mat4.create();

            mat4.translate(
                modelViewMatrix,
                modelViewMatrix,
                // prettier-ignore
                [Math.sin(animationIndex) * 0.8, 0.0, -8.0],
            );

            mat4.rotate(
                modelViewMatrix,
                modelViewMatrix,
                Math.sin(animationIndex) * 2.0,
                // prettier-ignore
                [0, 1, 1],
            );

            return modelViewMatrix;
        };

        const projectionMatrix = _setProjectionMatrix();

        const modelViewMatrix = _setModelViewMatrix();

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
                offset,
            );

            gl.enableVertexAttribArray(bufferPosition);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix,
        );

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix,
        );

        {
            const vertexCount = BoxObject.indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}
