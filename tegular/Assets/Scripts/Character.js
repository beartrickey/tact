#pragma strict

// public var coordinates : Vector3;	// Coordinates of 3D volume the character is occupying
// public var down : Vector3;			// Vector showing the character's downward direction

// function onInstantiate()
// {

// 	gameObject.SetActive( false );

// }


// function onInitialize( _characterCoordinates : Vector3, _down : Vector3 )
// {

// 	gameObject.SetActive( true );

// 	coordinates = _characterCoordinates;
// 	down = _down;

// 	// Position
// 	setPositionForCoordinates();

// 	// Rotation
// 	setRotationForDownVector();

// }


// function setPositionForCoordinates()
// {

// 	gameObject.transform.position = (coordinates * Tile.blockSize) + (down * 0.5);

// }


// function setRotationForDownVector()
// {

// 	// Up
// 	if( down == Block.facingList[1] )
// 		gameObject.transform.eulerAngles = Vector3( 0.0, 0.0, 0.0 );

// 	// Down
// 	if( down == Block.facingList[0] )
// 		gameObject.transform.eulerAngles = Vector3( 180.0, 0.0, 0.0 );

// 	// North
// 	if( down == Block.facingList[3] )
// 		gameObject.transform.eulerAngles = Vector3( 90.0, 0.0, 0.0 );

// 	// South
// 	if( down == Block.facingList[2] )
// 		gameObject.transform.eulerAngles = Vector3( -90.0, 0.0, 0.0 );

// 	// East
// 	if( down == Block.facingList[5] )
// 		gameObject.transform.eulerAngles = Vector3( 0.0, 0.0, -90.0 );

// 	// West
// 	if( down == Block.facingList[4] )
// 		gameObject.transform.eulerAngles = Vector3( 0.0, 0.0, 90.0 );

// }


// function moveToNewFace( _face : Face )
// {

// 	coordinates = _face.parentBlock.coordinates + _face.facing;
// 	down = _face.facing * -1.0;

// 	setPositionForCoordinates();
// 	setRotationForDownVector();

// 	SublayerGameDelegate.instance.setMovableFacesForCharacter( this );

// }


// function characterUpdate()
// {



// }


