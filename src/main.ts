// Utils
import { Renderer } from './renderer/renderer';

// Scene data
import { FRAGMENT_SOURCE, VERTEX_SOURCE } from './renderer/shaders';
import { Box } from './objects/box';

// @ts-ignore
import { GUI } from 'dat.gui';

window.onload = () => {
    // Get DOM references
    const glCanvasRef = document.getElementById(
        'glCanvas',
    ) as HTMLCanvasElement;

    // Get WebGL2 context
    const gl: WebGL2RenderingContext = glCanvasRef.getContext('webgl2');
    if (gl === null) {
        throw new Error(
            'Unable to initialize WebGL. Your browser or machine may not support it.',
        );
    }

    // Run an instance of the Renderer with WebGL Context and the state of the GUI
    const scene = new Renderer(gl);
    scene.initProgram(VERTEX_SOURCE, FRAGMENT_SOURCE);
    scene.initBuffers(new Box());
    scene.runFrames();

    const gui = new GUI();
    gui.add(scene.rotation, 'x', 0, Math.PI * 2);
    gui.add(scene.rotation, 'y', 0, Math.PI * 2);
    gui.add(scene.rotation, 'z', 0, Math.PI * 2);
};
