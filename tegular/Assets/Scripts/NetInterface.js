// #pragma strict

// import SimpleJSON;

// function Start()
// {

// 	var url : String = "http://127.0.0.1:8000/test/";

// 	var www : WWW = new WWW (url);

// 	// Wait for download to complete
// 	yield www;

// 	// Assign texture
// 	// Debug.Log(www.poop);
// 	Debug.Log(www.text);

// 	var jsonObject = JSON.Parse(www.text);

// 	var myBool : boolean = jsonObject["true"].AsBool;
// 	var myInt : int = jsonObject["five"].AsFloat;

// 	if( myBool == true )
// 	{
// 		Debug.Log("myBool is true");
// 	}

// 	if( myInt == 5 )
// 	{
// 		Debug.Log("myInt is 5");
// 	}

// }

// function Update () {

// }