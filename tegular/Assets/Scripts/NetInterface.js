#pragma strict

import SimpleJSON;

function Start()
{

	

}


function loadTerrainData()
{

	// SimpleJson example
	// 	var myBool : boolean = jsonObject["true"].AsBool;
	// 	var myInt : int = jsonObject["five"].AsFloat;

	var url : String = "http://127.0.0.1:8000/battle/";

	var www : WWW = new WWW (url);

	// Wait for download to complete
	yield www;

	Debug.Log(www.text);

	var jsonObject = JSON.Parse(www.text);

	// Block data
	var tileDataList = jsonObject["terrain_data_list"];
	for( var t : int = 0; t < tileDataList.Count; t++ )
	{

		var tileData = tileDataList[t];

		// Coordinates
		var coordinateArray = tileData;
		
		var tileCoordinates : Vector3 = Vector3(
			coordinateArray[0].AsFloat,
			coordinateArray[1].AsFloat,
			coordinateArray[2].AsFloat
		);

		// Initialize new block
		var tile : Tile = SublayerGameDelegate.instance.getFreeBlock();

		tile.onInitialize( tileCoordinates );

	}

	// Battle frame data
	var battleFrameList = jsonObject["battle_frame_list"];
	for( var b : int = 0; b < battleFrameList.Count; b++ )
	{

		var battleFrame = battleFrameList[b];

		Debug.Log(battleFrame["number"].AsInt);

		for( var f : int = 0; f < battleFrame["information_dictionary"]["forces"].Count; f++ )
		{

			var forceData = battleFrame["information_dictionary"]["forces"][f];

			var characterCoordinates : Vector3 = Vector3(
				forceData["coordinates"][0].AsFloat,
				forceData["coordinates"][1].AsFloat,
				forceData["coordinates"][2].AsFloat
			);
			
			var character : Character = SublayerGameDelegate.instance.getFreeCharacter();
			character.onInitialize( characterCoordinates );

		}

	}

}


function loadBattleFrames()
{

}



function loadPlayerCommitFrames()
{

}




