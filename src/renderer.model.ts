export interface Buffers {
    position: WebGLBuffer
    color: WebGLBuffer
}

export interface ProgramInfo {
    program: WebGLProgram,
    attribLocations: {
        vertexPosition: number,
        vertexColor: number
    },
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation,
        modelViewMatrix: WebGLUniformLocation
    }
}
