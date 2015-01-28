#pragma strict

public static var tileWidth : float = 1.0;
public static var heightIncrement : float = 1.0;
public var coordinates : Vector3;
public var meshCollider : MeshCollider = null;
public var mesh : Mesh = null;


function onInstantiate()
{

	gameObject.SetActive( false );
	mesh = gameObject.GetComponent( MeshFilter ).mesh;
	meshCollider = gameObject.GetComponent( MeshCollider );


	// Set button touch up inside function
	var buttonScript : ButtonScript = gameObject.GetComponent( ButtonScript );
	SublayerGameDelegate.instance.sl.addButton( buttonScript );
	buttonScript.onTouchUpInsideDelegate = tileClicked;

}


function onInitialize( _tileCoordinates : Vector3 )
{

	gameObject.SetActive( true );

	// Position
	gameObject.transform.position = Vector3(
		_tileCoordinates.x * tileWidth,
		0.0,
		_tileCoordinates.z * tileWidth
	);

	coordinates = _tileCoordinates;

	arrangeVerts(false);

}



function tileClicked( _buttonScript : ButtonScript )
{

	Debug.Log( "tileClicked" );

	GameManager.instance.netInterface.getVisibleTiles(coordinates);

	// if( movable )
	// {
	// 	SublayerGameDelegate.instance.character.moveToNewFace( this );
	// }

}



function tileUpdate()
{

	

}



function arrangeVerts( _selected : boolean ){
	////////////////////////////////////
	// Vertex Positions
	////////////////////////////////////
	var newVertices : Vector3[] = mesh.vertices;
	
	var topVertexHeight : float = coordinates.y * heightIncrement;

	// SIDE 1
	newVertices[0].y = 0.0;
	newVertices[1].y = 0.0;
	newVertices[2].y = topVertexHeight;
	newVertices[3].y = topVertexHeight;

	// SIDE 2
	newVertices[6].y = 0.0;
	newVertices[7].y = 0.0;
	newVertices[10].y = topVertexHeight;
	newVertices[11].y = topVertexHeight;

	// TOP
	newVertices[4].y = topVertexHeight;
	newVertices[5].y = topVertexHeight;
	newVertices[8].y = topVertexHeight;
	newVertices[9].y = topVertexHeight;

	// BOTTOM
	newVertices[12].y = 0.0;
	newVertices[13].y = 0.0;
	newVertices[14].y = 0.0;
	newVertices[15].y = 0.0;

	// SIDE 3
	newVertices[16].y = 0.0;
	newVertices[17].y = topVertexHeight;
	newVertices[18].y = 0.0;
	newVertices[19].y = topVertexHeight;

	// SIDE 4
	newVertices[20].y = 0.0;
	newVertices[21].y = topVertexHeight;
	newVertices[22].y = 0.0;
	newVertices[23].y = topVertexHeight;


	////////////////////////////////////
	// Vertex Colors
	////////////////////////////////////
	var newColors : Color[] = new Color[newVertices.Length];

	var topColorValue : float = 0.5 + (coordinates.y * 0.1);
	var topColor : Color = Color(topColorValue, topColorValue, topColorValue, 1.0);
	if( _selected == true )
	{
		topColor = Color.red;
	}
	var sideOneColor : Color = Color(0.5, 0.5, 0.5, 1.0);
	var sideTwoColor : Color = Color(0.25, 0.25, 0.25, 1.0);
	var bottomColor : Color = Color(0.0, 0.0, 0.0, 1.0);

	// var topColor : Color = Color(0.0, 0.0, 0.0, 1.0);
	// var sideOneColor : Color = Color(0.5, 0.25, 0.125, 1.0);
	// var sideTwoColor : Color = Color(0.25, 0.125, 0.05, 1.0);
	// var bottomColor : Color = Color(0.0, 0.0, 0.0, 1.0);

	// if( coordinates.y == 1.0 )
	// {
	// 	topColor = Color(0.0, 1.0, 0.0, 1.0);
	// }
	// else if( coordinates.y == 2.0 )
	// {
	// 	topColor = Color(1.0, 1.0, 0.0, 1.0);
	// }
	// else if( coordinates.y == 3.0 )
	// {
	// 	topColor = Color(1.0, 0.0, 0.0, 1.0);
	// }


	// SIDE 1
	newColors[0] = sideOneColor;
	newColors[1] = sideOneColor;
	newColors[2] = sideOneColor;
	newColors[3] = sideOneColor;

	// SIDE 2
	newColors[6] = sideTwoColor;
	newColors[7] = sideTwoColor;
	newColors[10] = sideTwoColor;
	newColors[11] = sideTwoColor;
	
	// TOP
	newColors[4] = topColor;
	newColors[5] = topColor;
	newColors[8] = topColor;
	newColors[9] = topColor;

	// BOTTOM
	newColors[12] = bottomColor;
	newColors[13] = bottomColor;
	newColors[14] = bottomColor;
	newColors[15] = bottomColor;

	// SIDE 3
	newColors[16] = sideOneColor;
	newColors[17] = sideOneColor;
	newColors[18] = sideOneColor;
	newColors[19] = sideOneColor;

	// SIDE 4
	newColors[20] = sideTwoColor;
	newColors[21] = sideTwoColor;
	newColors[22] = sideTwoColor;
	newColors[23] = sideTwoColor;
	
	// Recalculate
	mesh.colors = newColors;
	mesh.vertices = newVertices;

	mesh.RecalculateNormals();
	mesh.RecalculateBounds();

	// Use this mesh for the collider
	meshCollider.sharedMesh = mesh;

}


