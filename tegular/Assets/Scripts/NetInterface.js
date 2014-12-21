#pragma strict

import SimpleJSON;

function Start()
{

	

}

function loadStageData()
{

	var url : String = "http://127.0.0.1:8000/test/";

	var www : WWW = new WWW (url);

	// Wait for download to complete
	yield www;

	Debug.Log(www.text);

	var jsonObject = JSON.Parse(www.text);

	//
	var myBool : boolean = jsonObject["true"].AsBool;
	var myInt : int = jsonObject["five"].AsFloat;

	if( myBool == true )
	{
		Debug.Log("myBool is true");
	}

	if( myInt == 5 )
	{
		Debug.Log("myInt is 5");
	}

}


function arrangeBlocksFromData()
{
	var url : String = "http://127.0.0.1:8000/test/";

	var www : WWW = new WWW (url);

	// Wait for download to complete
	yield www;

	var jsonObject = JSON.Parse(www.text);

	for( var b : int = 0; b < jsonObject.Count; b++ )
	{

		var blockData = jsonObject[b];

		// Coordinates
		var coordinateArray = blockData["coordinates"];
		
		var blockCoordinates : Vector3 = Vector3(
			coordinateArray[0].AsFloat,
			coordinateArray[1].AsFloat,
			coordinateArray[2].AsFloat
		);

		// Skip if there is already a block at these coordinates
		if( SublayerGameDelegate.instance.getBlockAtCoordinates( blockCoordinates ) )
			continue; 

		// Textures
		var tex0 : String = blockData["textures"][0];
		var tex1 : String = blockData["textures"][1];
		var tex2 : String = blockData["textures"][2];
		var tex3 : String = blockData["textures"][3];
		var tex4 : String = blockData["textures"][4];
		var tex5 : String = blockData["textures"][5];

		var tempTextureArray : String[] = [
			tex0, tex1, tex2, tex3, tex4, tex5
		];

		var textureArray : String[] = tempTextureArray;

		// Initialize new block
		var block : Block = SublayerGameDelegate.instance.getFreeBlock();

		block.onInitialize( blockCoordinates, textureArray );

	}

	// Turn off hidden faces
	SublayerGameDelegate.instance.turnOffHiddenFaces();

	// Set Character Positions
	SublayerGameDelegate.instance.character.onInitialize( Vector3(0.0, 1.0, 1.0), Vector3(0.0, 0.0, -1.0) );

	// TEST HACK
	SublayerGameDelegate.instance.setMovableFacesForCharacter( SublayerGameDelegate.instance.character );

}