// Utils
import { Renderer } from './renderer/renderer';

// Components
import { GuiComponent } from './gui/gui.component';
import { RangeInputComponent } from './gui/range-input/range-input.component';

// Scene data
import { FRAGMENT_SOURCE, VERTEX_SOURCE } from './renderer/shaders';
import { Box } from './objects/box';

window.onload = () => {
    // Register the <webgl-gui> element
    customElements.define('webgl-gui', GuiComponent);
    customElements.define('webgl-range-input', RangeInputComponent);

    // Get DOM references
    const glCanvasRef = document.getElementById(
        'glCanvas',
    ) as HTMLCanvasElement;
    const glGuiRef = document.getElementById('glGui') as GuiComponent;

    // Get WebGL2 context
    const gl: WebGL2RenderingContext = glCanvasRef.getContext('webgl2');
    if (gl === null) {
        throw new Error(
            'Unable to initialize WebGL. Your browser or machine may not support it.',
        );
    }

    // Setup Renderer once the GUI is ready
    document.addEventListener(
        'gui-ready',
        () => {
            // Run an instance of the Renderer with WebGL Context and the state of the GUI
            const renderer = new Renderer(gl, glGuiRef);
            renderer.initProgram(VERTEX_SOURCE, FRAGMENT_SOURCE);
            renderer.initBuffers(new Box());
            renderer.runFrames();
        },
        { once: true },
    );
};
