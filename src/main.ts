import { Renderer } from './renderer/renderer';
import { InputState } from './inputs/input-state';
import { FRAGMENT_SOURCE, VERTEX_SOURCE } from './renderer/shaders';
import { Box } from './objects/box';

window.onload = () => {
    const canvas: HTMLCanvasElement = document.querySelector('#glCanvas');
    const gl: WebGL2RenderingContext = canvas.getContext('webgl2');

    if (gl === null) {
        throw new Error(
            'Unable to initialize WebGL. Your browser or machine may not support it.',
        );
    }

    // Setting up <input> elements
    const inputState = new InputState();

    const renderer = new Renderer(inputState);
    renderer.gl = gl;
    renderer.initProgram(VERTEX_SOURCE, FRAGMENT_SOURCE);
    renderer.initBuffers(new Box());
    renderer.runFrames();
};
