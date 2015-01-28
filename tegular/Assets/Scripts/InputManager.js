#pragma strict



public static var keyboardEnabled : boolean = true;
public static var instance : InputManager;

public var touchBeganPosition = new Vector3[2];
public var lastTouchPosition = new Vector2[2];
public var currentTouchPosition = new Vector2[2];
public var touchDownFrames : int = 0;

public var cameraSwivel : GameObject = null;


function Start(){

	instance = this;
	
	Screen.showCursor = true;
	
}



function Update(){
	
	// Copy touch position
	lastTouchPosition[0] = currentTouchPosition[0];
	lastTouchPosition[1] = currentTouchPosition[1];

	// Increase townDownFrames
	if( touchDownFrames > 0 )
		touchDownFrames++;
	
	
	switch( Application.platform )
	{
	
		case RuntimePlatform.Android:
		case RuntimePlatform.IPhonePlayer:
		case RuntimePlatform.WP8Player:
		
			//touch
			handleTouchControls();
		
			break;
		
		case RuntimePlatform.OSXPlayer:
		case RuntimePlatform.OSXEditor:
		case RuntimePlatform.WindowsPlayer:
		case RuntimePlatform.WindowsEditor:
		case RuntimePlatform.LinuxPlayer:
		
			//mouse
			handleMouseControls();
			
			//keyboard input
			handleKeyboardControls();
			
			break;
		
		default:
			break;
		
	}
}



function handleTouchControls(){

	//touch began
	if( Input.touchCount > 0 )
	{
		if(Input.GetTouch(0).phase == TouchPhase.Began )
			touchBegan(0);
	}
	
	if( Input.touchCount > 1 )
	{
		if(Input.GetTouch(1).phase == TouchPhase.Began )
			touchBegan(1);
	}
	
	//moved
	if( Input.touchCount > 0 )
	{
		if(Input.GetTouch(0).phase == TouchPhase.Moved )
			touchMoved(0);
	}
	
	if( Input.touchCount > 1 )
	{
		if(Input.GetTouch(1).phase == TouchPhase.Moved )
			touchMoved(1);
	}
	
	//ended
	if( Input.touchCount > 0 )
	{
		if(Input.GetTouch(0).phase == TouchPhase.Ended )
			touchEnded(0);
	}
	
	if( Input.touchCount > 1 )
	{
		if(Input.GetTouch(1).phase == TouchPhase.Ended )
			touchEnded(1);
	}

}



function handleMouseControls(){

	//mouse button pressed down this frame
	if( Input.GetMouseButtonDown(0) == true )
	{
		mouseBegan();
	}
	
	
	//mouse button down
	if( Input.GetMouseButton(0) == true )
	{
		mouseMoved();
	}
	
	
	//mouse button released
	if( Input.GetMouseButtonUp(0) == true )
	{
		mouseEnded();
	}

}




function handleKeyboardControls(){

	// Example
	// if(Input.GetKey(KeyCode.K))
	if(Input.GetKeyDown(KeyCode.K))
	{
	
	}

}



function mouseBegan(){

	var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );

	lastTouchPosition[0] = currentTouchPosition[0] = touchBeganPosition[0] = Input.mousePosition;

	touchDownFrames = 1;

	// checkForButtonTouchDownInside( ray, 0 );
	
}



function mouseMoved(){

	var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
	var rayOrigin : Vector2 = ray.origin;

	currentTouchPosition[0] = Input.mousePosition;

	// checkForButtonRolloverRolloff( ray );

	// Move camera based on mouse movement
	var dif : Vector2 = currentTouchPosition[0] - lastTouchPosition[0];

	var swivelCoefficient : float = 0.5;
	var xSwivel : float = dif.y * -swivelCoefficient;
	var ySwivel : float = dif.x * swivelCoefficient;

	cameraSwivel.transform.eulerAngles += Vector3( xSwivel, ySwivel, 0.0 );
	
}



function mouseEnded()
{
	
	Debug.Log( "mouseEnded" );
	var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
	
	// Only check for button clicks if the mouse was clicked down and up rapidly
	if( touchDownFrames < 10 && (currentTouchPosition[0] - lastTouchPosition[0]).magnitude < 10.0 )
	{
		checkForButtonTouchUpInside( ray );
	}

	// Reset touchDownFrames
	touchDownFrames = 0;
	
}




function touchBegan( _touchIndex : int ){

	//Debug.Log( "Touch " + _touchIndex + " began" );
	
	var ray : Ray = Camera.main.ScreenPointToRay( Input.GetTouch(_touchIndex).position );

	lastTouchPosition[_touchIndex] = currentTouchPosition[_touchIndex] = ray.origin;
	
	
	//special case for buttons that wait for second touch
	if( Input.touchCount == 2 )
	{
		var button : ButtonScript = GameManager.instance.activeSublayer.isButtonWaitingForSecondTouch();
		
		if( button != null )
		{
			button.onTwoTouchDownInside();
			return;
		}
		
	}

	checkForButtonTouchDownInside( ray, _touchIndex );

}




function touchMoved( _touchIndex : int ){

	//Debug.Log( "Touch " + _touchIndex + " moved" );
	
	var ray : Ray = Camera.main.ScreenPointToRay( Input.GetTouch(_touchIndex).position );

	checkForButtonRolloverRolloff( ray );
	
	currentTouchPosition[_touchIndex] = ray.origin;

}




function touchEnded( _touchIndex : int ){

	//Debug.Log( "Touch " + _touchIndex + " ended" );
	var ray : Ray = Camera.main.ScreenPointToRay( Input.GetTouch(_touchIndex).position );

	checkForButtonTouchUpInside( ray );
	
	//in the case of multitouch, if touch[0] ends, then touch[1] will become touch[0]...
	//because of this, we need to copy over the lastTouchPosition data from element 1 to 0 :(
	if( Input.touchCount > 1 )
	{
		currentTouchPosition[0] = currentTouchPosition[1];
		lastTouchPosition[0] = lastTouchPosition[1];
		
		currentTouchPosition[1] = Vector2( -1000.0, -1000.0 );
		lastTouchPosition[1] = Vector2( -1000.0, -1000.0 );
	}
	
	if( Input.touchCount == 1 )
	{
		currentTouchPosition[0] = Vector2( -1000.0, -1000.0 );
		lastTouchPosition[0] = Vector2( -1000.0, -1000.0 );
	}

}



function checkForButtonTouchDownInside( _ray : Ray, _touchIndex : int ){
	
	var buttonScript : ButtonScript = checkForButtonCollision( _ray );
	
	//normal button press
	if( buttonScript != null )
		buttonScript.onTouchDownInside();
	
}


function checkForButtonRolloverRolloff( _ray : Ray ){

	var buttonScript : ButtonScript = checkForButtonCollision( _ray );	
	
	//bail if no script available
	if( buttonScript == null )
		return;

}




function checkForButtonTouchUpInside( _ray : Ray ){

	Debug.Log( "checkForButtonTouchUpInside" );
	var buttonScript : ButtonScript = checkForButtonCollision( _ray );
	
	
	//bail if no script available
	if( buttonScript == null )
		return;
		
		
	//click button
    buttonScript.onTouchUpInside();

}




function checkForButtonCollision( _ray : Ray ) : ButtonScript{

	//reset all buttons
	GameManager.instance.activeSublayer.resetAllButtons();
	
	var hitList : RaycastHit[] = Physics.RaycastAll( _ray, 1000 );
	
	// Debug.Log( "hitList Length : " + hitList.length );
	
	
	//bail if nothing hit
	if( hitList.length <= 0 )
		return;
	
	
	Debug.Log( "hitList.length" + hitList.length );
	
	//loop through hit list for any buttons on screen
	var closestButton : ButtonScript = null;
	var closestDistance : float = 9999.99;
	
	
	for( var i : int = 0; i < hitList.length; i++ )
	{
	
		var hit : RaycastHit = hitList[i];
		
		var buttonScript : ButtonScript = hit.collider.GetComponent( ButtonScript );
		
		
		//skip if null
		if( buttonScript == null )
			continue;
			
		
		//skip if not child of active layer
		if( buttonScript.sublayer != GameManager.instance.activeSublayer )
			continue;
			
		
		//skip if not enabled
		if( buttonScript.buttonEnabled == false )
			continue;
			
		
		//store closest button
		if( hit.distance < closestDistance )
		{
			closestButton = buttonScript;
			closestDistance = hit.distance;
		}
        
	}
	
	
	//use closest button
	if( closestButton != null )
	{
	
		//register as being down
    	closestButton.isDown = true;
    	
    	return closestButton;
    	
    }
	
	
	return null;	

}


