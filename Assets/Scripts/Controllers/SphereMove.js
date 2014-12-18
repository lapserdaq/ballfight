#pragma strict

var speed : int;
var velocity : int;
var angularVelocity : int;

var pullRadius : int;
var pullForce :int;
var hited : int;

var radius = 5.0;
var power = 10.0;

var forceMode : ForceMode = ForceMode.VelocityChange;
var pushPower = 2.0f;
var fingerHold : boolean;
var startPos: Vector2;
var endPos: Vector2;

var joystick : Joystick;

function FixedUpdate(){
	Debug.Log("TEST: "+Input.GetKey("up"));
	if(Input.GetKey("up")){
		rigidbody.AddForce(Vector3.forward * speed * Time.deltaTime);
	}
	if(Input.GetKey("down")){
		rigidbody.AddForce(0,0,1 * (-speed) * Time.deltaTime);
	}
	if(Input.GetKey("left")){
		rigidbody.AddForce(Vector3.left * speed * Time.deltaTime);
	}
	if(Input.GetKey("right")){
		rigidbody.AddForce(Vector3.right * speed * Time.deltaTime);
	}
	
	rigidbody.AddForce(Vector3.forward * joystick.position.y * speed * Time.deltaTime);
	rigidbody.AddForce(Vector3.right * joystick.position.x * speed * Time.deltaTime);
		
	// Applies an explosion force to all nearby rigidbodies
    var explosionPos : Vector3 = transform.position;
    // get all colliders touching or inside the imaginary sphere:
    var colliders : Collider[] = Physics.OverlapSphere (explosionPos, radius);
    for (var hit : Collider in colliders) {
        if(hit.tag == "player2"){
        	Debug.Log("Object close: "+hit);
        	if (hit && hit.rigidbody){
        		//hit.rigidbody.AddExplosionForce(power, explosionPos, radius, 3.0);
        	}	
        }
    }

        /*if(Input.touchCount > 0){
            var touch : Touch = Input.GetTouch(0);
            if(touch.phase == TouchPhase.Began){
                startPos = touch.position;
                fingerHold = true;
            }
            else if(touch.phase == TouchPhase.Moved){
                endPos = touch.position;
            }
            else if(touch.phase == TouchPhase.Ended){
                fingerHold = false;
            }
        }

        if(fingerHold){

            var deltaX : float = endPos.x - startPos.x;
            var deltaY : float = endPos.y - startPos.y;
            var horizontal : boolean  = false;

            if(Mathf.Abs (deltaX) > Mathf.Abs (deltaY)) {
                horizontal = true;
            }

	        var movement : Vector3 = new Vector3(deltaX , 0, deltaY );
	        rigidbody.AddForce(movement * 20 * Time.deltaTime);
		}*/
	
}

function Update () {	
		if (Input.GetKeyDown(KeyCode.Escape)) { 
			Application.Quit();
		}
	}

function OnCollisionEnter(collision : Collision) {
	//1.Version static speed 
	if(collision.gameObject.tag == "player2"){
		var v : Vector3 = (collision.transform.position - transform.position).normalized * hited;
        collision.gameObject.rigidbody.AddForce(v);
	}
	
	//2.Version explosion
	//if(collision.gameObject.tag == "player2"){
	//	var explosionPos : Vector3 = transform.position;
	//	collision.gameObject.rigidbody.AddExplosionForce(power, explosionPos, radius, 3.0);
	//}
	
	//3.Version forceAtPosition
	/*if(collision.gameObject.tag == "player2"){
		var direction : Vector3 = collision.transform.position;
		direction.x = direction.x * hited;
		direction.y = direction.y * 0;
		direction.z = direction.z * hited;
		collision.gameObject.rigidbody.AddForceAtPosition(direction, Vector3(transform.position.x - collision.transform.position.x, transform.position.y - collision.transform.position.y, transform.position.z - collision.transform.position.z),forceMode);
	}*/
	
	//4.Version forceAtPosition ver2
	/*if(collision.gameObject.tag == "player2"){
		// Get the hit rigidbody (if there is one).
	    var body : Rigidbody = collision.gameObject.rigidbody;
	 
	    // no rigidbody
	    if (body == null || body.isKinematic)
	        return;
	         
	    // We dont want to push objects below us
	    if (collision.transform.position.y < -0.3) 
	        return;
	     
	    // Calculate push direction from move direction, 
	    // we only push objects to the sides never up and down
	    var pushDir : Vector3 = Vector3 (transform.position.x, 0, transform.position.z);
	 
	    // Apply the push
	    body.AddForceAtPosition( pushDir * pushPower, collision.transform.position, forceMode );
	}*/
	
	/*for (var contact : ContactPoint in collision.contacts) {
		print(contact.thisCollider.name + " hit " + contact.otherCollider.name);
		if(contact.otherCollider.tag == "player2"){	
			//var forceDirection : Vector3  = transform.position - contact.otherCollider.transform.position;
			//collision.collider.rigidbody.AddRelativeForce(forceDirection.normalized * pullForce * Time.fixedDeltaTime);
			var v : Vector3 = (transform.position - contact.otherCollider.transform.position).normalized;
			contact.otherCollider.rigidbody.AddRelativeForce(v * hited * Time.fixedDeltaTime);
		}	
	}*/
}


function OnControllerColliderHit(hit:ControllerColliderHit){
	Debug.Log("Object hit");
	//if(hit.gameObject.tag == "player2"){
	//	hit.rigidbody.AddForce(Vector3.forward * hited);
	//}
	
	// Get the hit rigidbody (if there is one).
    var body : Rigidbody = hit.rigidbody;
 
    // no rigidbody
    if (body == null || body.isKinematic)
        return;
         
    // We dont want to push objects below us
    if (hit.moveDirection.y < -0.3) 
        return;
     
    // Calculate push direction from move direction, 
    // we only push objects to the sides never up and down
    var pushDir : Vector3 = Vector3 (hit.moveDirection.x, 0, hit.moveDirection.z);
 
    // Apply the push
    body.AddForceAtPosition( pushDir * pushPower, hit.point, forceMode );

}



/*function OnTriggerEnter (other : Collider) {
	if(other.gameObject.tag == "GravityPusher"){
		other.gameObject.SetActive(false);
	}else{
		var forceDirection : Vector3  = transform.position - collider.transform.position;
		other.rigidbody.AddForce(forceDirection.normalized * pullForce * Time.fixedDeltaTime);
		
		var hitColliders = Physics.OverlapSphere(transform.position, pullRadius);
	
		for (var i = 0; i < hitColliders.Length; i++) {
				var forceDirection : Vector3  = transform.position - collider.transform.position;
				hitColliders[i].rigidbody.AddForce(forceDirection.normalized * pullForce * Time.fixedDeltaTime);
		}
	}		
}*/

//var explosionPrefab : Transform;

//function OnCollisionEnter(collision : Collision) {
		
//		var forceDirection : Vector3  = transform.position - collision.collider.transform.position;
//		collision.collider.rigidbody.AddRelativeForce(forceDirection.normalized * pullForce * Time.fixedDeltaTime);
		
		 // Rotate the object so that the y-axis faces along the normal of the surface
	    /*var contact = collision.contacts[0];
	    var rot = Quaternion.FromToRotation(Vector3.up, contact.normal);
	    var pos = contact.point;
	    Instantiate(explosionPrefab, pos, rot);
	    // Destroy the projectile
	    Destroy (gameObject);
		*/
		
		// Debug-draw all contact points and normals
		/*for (var contact : ContactPoint in collision.contacts) {
			//Debug.DrawRay(contact.point, contact.normal, Color.white);
			var forceDirection : Vector3  = transform.position - contact.collider.transform.position;
			contact.collider.rigidbody.AddForce(forceDirection.normalized * pullForce * Time.fixedDeltaTime);
		}*/
		
		// Play a sound if the coliding objects had a big impact.		
		//if (collision.relativeVelocity.magnitude > 2)
		//	audio.Play();
//}


/*#pragma strict

var speed1 : int;

function Update(){
	var translation : float = Input.GetAxis ("Vertical");
	var rotation : float = Input.GetAxis ("Horizontal");
	
	var movement : Vector3  = new Vector3(rotation, 0, translation);
	
	rigidbody.AddForce (movement * speed1 * Time.deltaTime);
	
}

function FixedUpdate(){
	

}*/

/*// speed of the ball
 var speed = 5.0;
 var radius = 1.0;
 private var velocity : Vector3 = Vector3.zero;
 
  
 function Start(){
     transform.localScale = Vector3.one * radius * 2;
     var hit : RaycastHit;
     if(Physics.Linecast(transform.position, transform.position - Vector3.up * 500, hit)){
         transform.position = hit.point + Vector3.up * radius;
     }
     // add a rigidbody if we dont have one.
     if(!rigidbody)
         gameObject.AddComponent(Rigidbody);
     // set the mass according to the radius.
     rigidbody.mass = 100 * radius;
 }
  
 function FixedUpdate () {
     // let see if our body is on the ground.
     var hit : RaycastHit;
     var isGrounded = Physics.Raycast(transform.position, -Vector3.up, hit, radius * 1.5);
     
     // base movement off of the camera, not the object.
     // reset the camera's X to zero, so that it is always looking horizontally.
     var x = Camera.main.transform.localEulerAngles.x;
     Camera.main.transform.localEulerAngles.x = 0;
     
     // now collect the movement stuff This is generic direction.
     var direction = Vector3(Input.GetAxis("Horizontal"),0,Input.GetAxis("Vertical"));
     
     // prevent the ball from moving faster diagnally
     if(direction.magnitude > 1.0) direction.Normalize();
     
     // If we are grounded, then lets see if we want to jump.
     if(isGrounded && Input.GetKeyDown(KeyCode.Space))
         rigidbody.AddForce(Vector3.up * rigidbody.mass * 500);
     
     // if we arent pressing anything, dont mess with the physics.
     if(direction.magnitude > 0){
         // convert isGrounded into something we can use
         var modifier = isGrounded ? 3.0 : 0.5;
         // lets set the direction according to the camera now.
         direction = Camera.main.transform.TransformDirection(direction) * speed * 2;
         // lets take the downward velocity from the current so that we dont get wierd physics results
         direction.y = rigidbody.velocity.y;
         
         // Now, lets keep track of a velocity.
         // This will let the ball move while we are not pressing anything.
         rigidbody.velocity = Vector3.Lerp(rigidbody.velocity, direction, modifier * Time.deltaTime);
         // Now, lets break the rotation out from the movement.
         var rotation = Vector3(rigidbody.velocity.z,0,-rigidbody.velocity.x) * 20;
         
         
         // Lets add some spin to make the ball move better
         rigidbody.angularVelocity = Vector3.Lerp(rigidbody.angularVelocity, rotation, modifier * Time.deltaTime);
     }
   
     
     // return the camera's x rotation.
     Camera.main.transform.localEulerAngles.x = x;
 }*/
 
 function Start(){
 	//QualitySettings.antiAliasing = 2;
 }
 
 