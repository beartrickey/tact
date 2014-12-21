#pragma strict

public var coordinates : Vector3;	// Coordinates of 3D volume the character is occupying
public var down : Vector3;			// Vector showing the character's downward direction

function onInstantiate()
{

	gameObject.SetActive( false );

}


function onInitialize( _characterCoordinates : Vector3, _down : Vector3 )
{

	coordinates = _characterCoordinates;
	down = _down;
	gameObject.SetActive( true );
	gameObject.transform.position = (_characterCoordinates * Tile.blockSize) + (down * 0.5);
	
}


function characterUpdate()
{

}