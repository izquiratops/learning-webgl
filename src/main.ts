import { Renderer } from "./renderer";

function main() {
    const canvas: HTMLCanvasElement = document.querySelector("#glCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    const gl = canvas.getContext("webgl");

    if (gl === null) {
        throw new Error(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
    }

    const renderer = new Renderer();
    renderer.initRenderingContext(gl);
}

window.onload = main;
