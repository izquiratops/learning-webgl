import { Renderer } from './renderer/renderer';
import { Box } from './objects/box';

window.onload = () => {
    const canvas: HTMLCanvasElement = document.querySelector('#glCanvas');
    const gl: WebGL2RenderingContext = canvas.getContext('webgl2');

    if (gl === null) {
        throw new Error(
            'Unable to initialize WebGL. Your browser or machine may not support it.',
        );
    }

    const renderer = new Renderer();
    const programInfo = renderer.initProgram(gl);
    const buffers = renderer.loadBuffers(gl, new Box());

    renderer.run(gl, programInfo, buffers);
};
