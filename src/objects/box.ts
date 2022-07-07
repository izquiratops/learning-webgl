export class Box {
    // prettier-ignore
    vertices = [
		// Front face
		-1.0, -1.0,  1.0,
		 1.0, -1.0,  1.0,
		 1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,

  		// Back face
  		-1.0, -1.0, -1.0,
  		-1.0,  1.0, -1.0,
    	 1.0,  1.0, -1.0,
		 1.0, -1.0, -1.0,

  		// Top face
  		-1.0,  1.0, -1.0,
  		-1.0,  1.0,  1.0,
    	 1.0,  1.0,  1.0,
    	 1.0,  1.0, -1.0,

  		// Bottom face
  		-1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
  		-1.0, -1.0,  1.0,

  		// Right face
  	     1.0, -1.0, -1.0,
  	     1.0,  1.0, -1.0,
  	     1.0,  1.0,  1.0,
  	     1.0, -1.0,  1.0,

  		// Left face
  		-1.0, -1.0, -1.0,
  		-1.0, -1.0,  1.0,
  		-1.0,  1.0,  1.0,
  		-1.0,  1.0, -1.0,
  	];

    // prettier-ignore
    colors = [
	    [255,  255,  255,  255], // Front face: white
	    [255,    0,    0,  255], // Back face: red
	    [  0,  255,    0,  255], // Top face: green
	    [  0,    0,    0,  255], // Bottom face: blue
	    [255,  255,    0,  255], // Right face: yellow
	    [255,    0,  255,  255], // Left face: purple
    ].reduce((acc, curr) => acc.concat(curr, curr, curr, curr), []);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    // prettier-ignore
    indices = [
		  0,  1,  2,      0,  2,  3,    // Front
		  4,  5,  6,      4,  6,  7,    // Back
		  8,  9,  10,     8,  10, 11,   // Top
		  12, 13, 14,     12, 14, 15,   // Bottom
		  16, 17, 18,     16, 18, 19,   // Right
		  20, 21, 22,     20, 22, 23,   // Left
    ];
}
