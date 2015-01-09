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

	var jsonObject = JSON.Parse(www.text);

	// Block data
	var tileDataList = jsonObject["tile_data_list"];
	for( var b : int = 0; b < tileDataList.Count; b++ )
	{

		var tileData = tileDataList[b];

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

}


function loadBattleFrames()
{

}



function loadPlayerCommitFrames()
{

}




