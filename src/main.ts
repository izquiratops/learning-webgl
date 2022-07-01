import { Renderer } from './renderer';

window.onload = () => {
    const canvas: HTMLCanvasElement = document.querySelector('#glCanvas');
    const gl: WebGLRenderingContext = canvas.getContext('webgl');

    if (gl === null) {
        throw new Error(
            'Unable to initialize WebGL. Your browser or machine may not support it.',
        );
    }

    const renderer = new Renderer(gl);
};
