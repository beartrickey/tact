﻿#pragma strict


public static var instance : SublayerGameDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//----------------------------------------
// Blocks
//----------------------------------------
public static var numBlocks : int = 128;
public var blockList = new Tile[numBlocks];


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

	// Character
	var characterPrefab : GameObject = Resources.Load("Character");

	for( var c : int = 0; c < numCharacters; c++ )
	{
		var characterGameObject : GameObject = GameObject.Instantiate( characterPrefab, Vector3.zero, characterPrefab.transform.rotation );
		var character : Character = characterGameObject.GetComponent( Character );
		characterList[c] = character;
		character.onInstantiate();
	}


	// Blocks
	var blockPrefab : GameObject = Resources.Load("Tile");

	for( var b : int = 0; b < numBlocks; b++ )
	{
		var blockGameObject : GameObject = GameObject.Instantiate( blockPrefab, Vector3.zero, blockPrefab.transform.rotation );
		var block : Tile = blockGameObject.GetComponent( Tile );
		blockList[b] = block;
		block.onInstantiate();
	}

	GameManager.instance.netInterface.loadTerrainData();

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

function getFreeCharacter()
{

	for( var c : int = 0; c < numCharacters; c++ )
	{

		var character : Character = characterList[c];

		if( character.gameObject.activeSelf == false )
		{

			return character;

		}
		
	}

	return null;

}


// What faces can character move to?
// highlight those faces
// if highlighted faces are clicked, move chacter to that space and orientation


// Any block with a face facing current coordinates.
// Any block adjacent to the piece's standing block.





//----------------------------------------
// Blocks
//----------------------------------------



// function arrangeBlocksFromData( _data : Boo.Lang.Hash[] )
// {
// 	// Uses Boo.Lang.Hash[] and System.Collections.Hashtable for temporary local testing.
// 	// Will need to use SimpleJson (or something similar) when we want to pull JSON from Django.
// 	// See "NetInterface.js" for an example of SimpleJson.

// 	for( var blockData : System.Collections.Hashtable in _data )
// 	{

// 		// var blockData : System.Collections.Hashtable = getFreeBlock();
// 		// Coordinates
// 		var coordinateArray : float[] = blockData["coordinates"];
		
// 		var blockCoordinates : Vector3 = Vector3(
// 			coordinateArray[0],
// 			coordinateArray[1],
// 			coordinateArray[2]
// 		);

// 		// Skip if there is already a block at these coordinates
// 		if( getBlockAtCoordinates( blockCoordinates ) )
// 			continue; 

// 		// Textures
// 		var textureArray : String[] = blockData["textures"];

// 		if( textureArray == null )
// 			textureArray = new String[0];

// 		// Initialize new block
// 		var block : Tile = getFreeBlock();

// 		block.onInitialize( blockCoordinates, textureArray );

// 	}

// 	// turnOffHiddenFaces();

// }


// function turnOffHiddenFaces()
// {

// 	for( var b : int = 0; b < numBlocks; b++ )
// 	{

// 		var block : Block = blockList[b];

// 		if( block.gameObject.activeSelf == false )
// 			continue;

// 		for( var f : int = 0; f < 6; f++ )
// 		{
// 			var face : Face = block.faceList[f];
// 			var absoluteCoordinates : Vector3 = block.coordinates + face.facing;
// 			var adjacentBlock : Block = getBlockAtCoordinates( absoluteCoordinates );
// 			if( adjacentBlock )
// 			{
// 				face.gameObject.SetActive( false );
// 			}
// 		}

// 	};

// }


// function getCharacterStandingFace( _character : Character )
// {

// 	var faceList = new Array();

// 	for( var b : int = 0; b < numBlocks; b++ )
// 	{

// 		var block : Block = blockList[b];

// 		if( block.gameObject.activeSelf == false )
// 			continue;

// 		faceList = faceList.Concat( block.getFacesNearPoint( character.gameObject.transform.position, 0.5 ) );

// 	};

// 	// We should only have one element in the faceList at the end
// 	return faceList[0];

// }


// function setAllFacesToUnmovable()
// {
// 	for( var b : int = 0; b < numBlocks; b++ )
// 	{

// 		var block : Tile = blockList[b];

// 		if( block.gameObject.activeSelf == false )
// 			continue;

// 		for( var f : int = 0; f < 6; f++ )
// 		{
// 			block.faceList[f].setMovable( false );
// 		}

// 	};
// }


// function setMovableFacesForCharacter( _character : Character )
// {

// 	// Get character standing face
// 	var characterStandingFace : Face = getCharacterStandingFace( _character );

// 	// Reset all faces
// 	setAllFacesToUnmovable();

// 	var faceList = new Array();

// 	for( var b : int = 0; b < numBlocks; b++ )
// 	{

// 		var block : Block = blockList[b];

// 		if( block.gameObject.activeSelf == false )
// 			continue;

// 		faceList = faceList.Concat( block.getAdjacentFaces( characterStandingFace ) );

// 	};

// 	for( var f : int = 0; f < faceList.length; f++ )
// 	{
// 		var face : Face = faceList[f];
// 		face.setMovable( true );
// 	}

// }



function getBlockAtCoordinates( _coordinates )
{

	for( var b : int = 0; b < numBlocks; b++ )
	{

		var block : Tile = blockList[b];

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

		var block : Tile = blockList[b];

		if( block.gameObject.activeSelf == false )
		{

			return block;

		}
		
	}

	return null;

}



function resetBlockColors()
{

	for( var b : int = 0; b < numBlocks; b++ )
	{

		var block : Tile = blockList[b];

		if( block.gameObject.activeSelf == false )
			continue;

		block.arrangeVerts(false);
		
	}

	return null;

}




