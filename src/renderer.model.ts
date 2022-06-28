export interface Buffers {
    position: WebGLBuffer
    color: WebGLBuffer
}

export interface VertexAttribute {
    buffer: WebGLBuffer,
    bufferPosition: number,
    size: number,
    type: number,
    normalized: boolean,
    stride: number,
    offset: number
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
