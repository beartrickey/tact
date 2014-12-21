#pragma strict

public var parentBlock : Block;
public var facing : Vector3;
public var movable : boolean = false;

function onInstantiate( _parentBlock, _facing )
{

	parentBlock = _parentBlock;
	facing = _facing;

	// Set button touch up inside function
	var buttonScript : ButtonScript = gameObject.GetComponent( ButtonScript );
	SublayerGameDelegate.instance.sl.addButton( buttonScript );
	buttonScript.onTouchUpInsideDelegate = faceClicked;

}


function setMovable( _movable : boolean )
{

	movable = _movable;

	if( movable )
	{
		gameObject.renderer.material.SetColor( "_Color", Color(0.75, 0.75, 1.0, 1.0) );
	}
	else
	{
		gameObject.renderer.material.SetColor( "_Color", Color(1.0, 1.0, 1.0, 1.0) );
	}

}


function faceClicked( _buttonScript : ButtonScript )
{

	Debug.Log( "faceClicked" );

	if( movable )
	{
		SublayerGameDelegate.instance.character.moveToNewFace( this );
	}

}


