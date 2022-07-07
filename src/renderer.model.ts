export interface Buffers {
    position: WebGLBuffer;
    color: WebGLBuffer;
    index?: WebGLBuffer;
}

export interface VertexAttribute {
    buffer: WebGLBuffer;
    bufferPosition: GLuint;
    size: GLint;
    type: GLenum;
    normalized: GLboolean;
    stride: GLsizei;
    offset: GLintptr;
}

export interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: GLint;
        vertexColor: GLint;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation;
    };
}
