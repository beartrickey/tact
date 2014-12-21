#pragma strict


public static var instance : SublayerGameDelegate;


public var gm : GameManager;
public var sl : Sublayer;


//----------------------------------------
// Blocks
//----------------------------------------
public static var numBlocks : int = 64;
public var blockList = new Tile[numBlocks];

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
	var blockPrefab : GameObject = Resources.Load("Tile");

	for( var b : int = 0; b < numBlocks; b++ )
	{
		var blockGameObject : GameObject = GameObject.Instantiate( blockPrefab, Vector3.zero, blockPrefab.transform.rotation );
		var block : Tile = blockGameObject.GetComponent( Tile );
		blockList[b] = block;
		block.onInstantiate();
	}

	arrangeBlocksFromData( tempBlockData );

}


//----------------------------------------
// Update
//----------------------------------------
function sublayerGameUpdate()
{

}



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

	// System.Collections.Hashtable

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
		var block : Tile = getFreeBlock();

		block.onInitialize( blockCoordinates );

	}

}



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




