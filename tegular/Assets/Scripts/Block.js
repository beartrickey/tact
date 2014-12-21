#pragma strict

public static var blockSize : float = 1.0;
public var coordinates : Vector3;
public var faceList = new Face[6];


function onInstantiate()
{

	gameObject.SetActive( false );

}


function onInitialize( _blockCoordinates : Vector3 )
{

	gameObject.SetActive( true );
	gameObject.transform.position = _blockCoordinates * blockSize;
	coordinates = _blockCoordinates;

}


function blockUpdate()
{

}



// function arrangeVerts(){

// 	////////////////////////////////////
// 	// Vertex Positions
// 	////////////////////////////////////
// 	var newVertices : Vector3[] = mesh.vertices;
	
// 	var topVertexHeight : float = height * heightIncrement;

// 	// SIDE 1
// 	newVertices[0].y = 0.0;
// 	newVertices[1].y = 0.0;
// 	newVertices[2].y = topVertexHeight;
// 	newVertices[3].y = topVertexHeight;

// 	// SIDE 2
// 	newVertices[6].y = 0.0;
// 	newVertices[7].y = 0.0;
// 	newVertices[10].y = topVertexHeight;
// 	newVertices[11].y = topVertexHeight;

// 	// TOP
// 	newVertices[4].y = topVertexHeight;
// 	newVertices[5].y = topVertexHeight;
// 	newVertices[8].y = topVertexHeight;
// 	newVertices[9].y = topVertexHeight;

// 	// BOTTOM
// 	newVertices[12].y = 0.0;
// 	newVertices[13].y = 0.0;
// 	newVertices[14].y = 0.0;
// 	newVertices[15].y = 0.0;

// 	// SIDE 3
// 	newVertices[16].y = 0.0;
// 	newVertices[17].y = topVertexHeight;
// 	newVertices[18].y = 0.0;
// 	newVertices[19].y = topVertexHeight;

// 	// SIDE 4
// 	newVertices[20].y = 0.0;
// 	newVertices[21].y = topVertexHeight;
// 	newVertices[22].y = 0.0;
// 	newVertices[23].y = topVertexHeight;


// 	////////////////////////////////////
// 	// Vertex Colors
// 	////////////////////////////////////
// 	var newColors : Color[] = new Color[newVertices.Length];

// 	var topLightGreyValue : float = 0.5 + (height * 0.1);
// 	var topLightGrey : Color = Color(topLightGreyValue, topLightGreyValue, topLightGreyValue, 1.0);
// 	var grey : Color = Color(0.5, 0.5, 0.5, 1.0);
// 	var darkGrey : Color = Color(0.25, 0.25, 0.25, 1.0);
// 	var black : Color = Color(0.0, 0.0, 0.0, 1.0);

// 	// SIDE 1
// 	newColors[0] = darkGrey;
// 	newColors[1] = darkGrey;
// 	newColors[2] = darkGrey;
// 	newColors[3] = darkGrey;

// 	// SIDE 2
// 	newColors[6] = grey;
// 	newColors[7] = grey;
// 	newColors[10] = grey;
// 	newColors[11] = grey;
	
// 	// TOP
// 	newColors[4] = topLightGrey;
// 	newColors[5] = topLightGrey;
// 	newColors[8] = topLightGrey;
// 	newColors[9] = topLightGrey;

// 	// BOTTOM
// 	newColors[12] = grey;
// 	newColors[13] = grey;
// 	newColors[14] = grey;
// 	newColors[15] = grey;

// 	// SIDE 3
// 	newColors[16] = grey;
// 	newColors[17] = grey;
// 	newColors[18] = grey;
// 	newColors[19] = grey;

// 	// SIDE 4
// 	newColors[20] = darkGrey;
// 	newColors[21] = darkGrey;
// 	newColors[22] = darkGrey;
// 	newColors[23] = darkGrey;
	
// 	// Recalculate
// 	mesh.colors = newColors;
// 	mesh.vertices = newVertices;

// 	mesh.RecalculateNormals();
// 	mesh.RecalculateBounds();

// 	// Use this mesh for the collider
// 	meshCollider.sharedMesh = mesh;

// }


