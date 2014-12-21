#pragma strict

public var parentBlock : Block;
public var facing : Vector3;

function onInstantiate( _parentBlock, _facing )
{

	parentBlock = _parentBlock;
	facing = _facing;

}