import { glMatrix, mat4 } from 'gl-matrix';
import { Buffers, ProgramInfo } from './types';
import { RendererHelper } from './renderer-helper';

import { FRAGMENT_SOURCE, VERTEX_SOURCE } from './shaders';
import { Box } from '../objects/box';

export class Renderer {
    initProgram(gl: WebGL2RenderingContext): ProgramInfo {
        const shaderProgram = RendererHelper.createProgram(
            gl,
            VERTEX_SOURCE,
            FRAGMENT_SOURCE,
        );

        return {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'a_vertex'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'a_color'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(
                    shaderProgram,
                    'u_matrix',
                ),
            },
        };
    }

    loadBuffers(gl: WebGLRenderingContext, mesh: Box): Buffers {
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

        return {
            position: positionBuffer,
            color: colorBuffer,
            index: indexBuffer,
        };
    }

    run(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
        const render = () => {
            // Check if canvas has to be resized
            RendererHelper.resizeCanvasToDisplaySize(gl);

            // Draw scene on canvas
            this.drawScene(gl, programInfo, buffers);

            // Move to the following frame
            requestAnimationFrame(render);
        };

        render();
    }

    private drawScene(
        gl: WebGLRenderingContext,
        programInfo: ProgramInfo,
        buffers: Buffers,
    ) {
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
}
