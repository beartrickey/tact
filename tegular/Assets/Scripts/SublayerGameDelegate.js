#pragma strict


public static var instance : SublayerGameDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//----------------------------------------
// Blocks
//----------------------------------------
public static var numBlocks : int = 64;
public var blockList = new Block[numBlocks];


//----------------------------------------
// Characters
//----------------------------------------
public static var numCharacters : int = 8;
public var characterList = new Character[numCharacters];
public var character : Character = null;

//BUTTONS


function onInstantiate()
{

	//set singleton reference
	instance = this;
	

	//set updateDelegate
	sl.updateDelegate = sublayerGameUpdate;
	
	
	//start button
	// sl.addButton( startButton );
	// startButton.onTouchDownInsideDelegate = startButtonPressed;


	// Blocks
	var blockPrefab : GameObject = Resources.Load("Block");

	for( var b : int = 0; b < numBlocks; b++ )
	{
		var blockGameObject : GameObject = GameObject.Instantiate( blockPrefab, Vector3.zero, blockPrefab.transform.rotation );
		var block : Block = blockGameObject.GetComponent( Block );
		blockList[b] = block;
		block.onInstantiate();
	}

	arrangeBlocksFromData( tempBlockData );

	// Character
	character.onInitialize( Vector3(0.0, 1.0, 1.0), Vector3(0.0, 0.0, -1.0) );

	// TEST HACK
	setMovableFacesForCharacter( character );

}


//----------------------------------------
// Update
//----------------------------------------
function sublayerGameUpdate()
{



}



//----------------------------------------
// Characters
//----------------------------------------


// What faces can character move to?
// highlight those faces
// if highlighted faces are clicked, move chacter to that space and orientation


// Any block with a face facing current coordinates.
// Any block adjacent to the piece's standing block.





//----------------------------------------
// Blocks
//----------------------------------------

public static var tempBlockData = [

	// Row 1
	{
		"coordinates": [-1.0, 0.0, 0.0]
	},
	{
		"coordinates": [0.0, 0.0, 0.0]
	},
	{
		"coordinates": [0.0, 1.0, 0.0]
	},
	{
		"coordinates": [1.0, 0.0, 0.0]
	},

	// Row 2
	{
		"coordinates": [-1.0, 0.0, 1.0]
	},
	{
		"coordinates": [0.0, 0.0, 1.0]
	},
	{
		"coordinates": [1.0, 0.0, 1.0]
	},

	// Row 3
	{
		"coordinates": [-1.0, 0.0, -1.0]
	},
	{
		"coordinates": [0.0, 0.0, -1.0]
	},
	{
		"coordinates": [1.0, 0.0, -1.0]
	},

	// Row 4
	{
		"coordinates": [-1.0, 0.0, -2.0]
	},
	{
		"coordinates": [1.0, 0.0, -2.0]
	}

];


function arrangeBlocksFromData( _data : Boo.Lang.Hash[] )
{
	// Uses Boo.Lang.Hash[] and System.Collections.Hashtable for temporary local testing.
	// Will need to use SimpleJson (or something similar) when we want to pull JSON from Django.
	// See "NetInterface.js" for an example of SimpleJson.

	for( var blockData : System.Collections.Hashtable in _data )
	{

		// var blockData : System.Collections.Hashtable = getFreeBlock();
		var coordinateArray : float[] = blockData["coordinates"];
		
		var blockCoordinates : Vector3 = Vector3(
			coordinateArray[0],
			coordinateArray[1],
			coordinateArray[2]
		);

		// Skip if there is already a block at these coordinates
		if( getBlockAtCoordinates( blockCoordinates ) )
			continue; 

		// Initialize new block
		var block : Block = getFreeBlock();

		block.onInitialize( blockCoordinates );

	}

}


function getCharacterStandingFace( _character : Character )
{

	var faceList = new Array();

	for( var b : int = 0; b < numBlocks; b++ )
	{

		var block : Block = blockList[b];

		if( block.gameObject.activeSelf == false )
			continue;

		faceList = faceList.Concat( block.getFacesNearPoint( character.gameObject.transform.position, 0.5 ) );

	};

	// We should only have one element in the faceList at the end
	return faceList[0];

}


function setAllFacesToUnmovable()
{
	for( var b : int = 0; b < numBlocks; b++ )
	{

		var block : Block = blockList[b];

		if( block.gameObject.activeSelf == false )
			continue;

		for( var f : int = 0; f < 6; f++ )
		{
			block.faceList[f].setMovable( false );
		}

	};
}


function setMovableFacesForCharacter( _character : Character )
{

	// Get character standing face
	var characterStandingFace : Face = getCharacterStandingFace( _character );

	// Reset all faces
	setAllFacesToUnmovable();

	var faceList = new Array();

	for( var b : int = 0; b < numBlocks; b++ )
	{

		var block : Block = blockList[b];

		if( block.gameObject.activeSelf == false )
			continue;

		faceList = faceList.Concat( block.getAdjacentFaces( characterStandingFace ) );

	};

	for( var f : int = 0; f < faceList.length; f++ )
	{
		var face : Face = faceList[f];
		face.setMovable( true );
	}

}



function getBlockAtCoordinates( _coordinates )
{

	for( var b : int = 0; b < numBlocks; b++ )
	{

		var block : Block = blockList[b];

		if( block.gameObject.activeSelf == false )
			continue;

		if( block.coordinates == _coordinates )
			return block;
		
	}

	return null;

}



function getFreeBlock()
{

	for( var b : int = 0; b < numBlocks; b++ )
	{

		var block : Block = blockList[b];

		if( block.gameObject.activeSelf == false )
		{

			return block;

		}
		
	}

	return null;

}




