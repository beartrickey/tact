#pragma strict

public var coordinates : Vector3;	// Coordinates of 3D volume the character is occupying
public var down : Vector3;			// Vector showing the character's downward direction

function onInstantiate()
{

	gameObject.SetActive( false );

}


function onInitialize( _characterCoordinates : Vector3 )
{

	gameObject.SetActive( true );

	coordinates = _characterCoordinates;

	// Position
	gameObject.transform.position = Vector3(
		_characterCoordinates.x * Tile.tileWidth,
		_characterCoordinates.y * Tile.heightIncrement,
		_characterCoordinates.z * Tile.tileWidth
	);

}


function characterUpdate()
{



}


