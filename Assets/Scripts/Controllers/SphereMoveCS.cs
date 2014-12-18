using UnityEngine;
using System.Collections;
using GooglePlayGames;
using GooglePlayGames.BasicApi.Multiplayer;
using UnityEngine.SocialPlatforms;
using System;

public class SphereMoveCS : MonoBehaviour {

	private string myName = "Player1";

	public int speed;
	public int velocity;
	public int angularVelocity;
	
	public int pullRadius;
	public int pullForce;
	public int hited;
	
	public float radius = 5.0f;
	public float power = 10.0f;
	
	public ForceMode forceMode = ForceMode.VelocityChange;
	public float pushPower = 2.0f;
	public bool fingerHold;
	public Vector2 startPos;
	public Vector2 endPos;
	
	public Joystick joystick;
	public Participant myself;
	public Opponent opponent;

	public bool isAdmin = false;
	public float opponentMovementX = 0.0f;
	public float opponentMovementY = 0.0f;

	public Vector3 myPosition;
	public Quaternion myRotation;
	public Vector3 opponentPosition;
	public Quaternion opponentRotation;

	public MainObject game;
	
	void Start(){
		Debug.Log ("dupa111");
		PlayGamesPlatform.DebugLogEnabled = true;
		PlayGamesPlatform.Activate();
		Social.localUser.Authenticate((bool success) => {
			Debug.Log ("dupa112");
			if(success) {	
				PlayGamesPlatform.Instance.RealTime.CreateQuickGame(1, 1,0, new MultiListener(this));
			} else {
				Application.Quit();
			}
		});
	}

	void FixedUpdate(){
		if (!game.playing) {
			return;
		}

		if (isAdmin) {			
			rigidbody.AddForce(Vector3.right * joystick.position.x * speed * Time.deltaTime);
			rigidbody.AddForce(Vector3.forward * joystick.position.y * speed * Time.deltaTime);
						
			opponent.rigidbody.AddForce(Vector3.right * opponentMovementX * speed * Time.deltaTime);
			opponent.rigidbody.AddForce(Vector3.forward * opponentMovementY * speed * Time.deltaTime);
		} else {
			sendToAdmin (joystick.position.x, joystick.position.y);
		}
		
	}
	
	void Update () {
		if (Input.GetKeyDown(KeyCode.Escape)) { 
			if(game.playing) {
				PlayGamesPlatform.Instance.RealTime.LeaveRoom();
			}
			Application.Quit();
		}
		if (!game.playing) {
			return;
		}	

		if (isAdmin) {			
			sendToUser();
		} else {
			transform.position = myPosition;
			transform.rotation = myRotation;
			opponent.transform.position = opponentPosition;
			opponent.transform.rotation = opponentRotation;
		}
	}

	void OnCollisionEnter(Collision collision) {
		//1.Version static speed 
		if (collision.gameObject.name == "Opponent") {
			Vector3 v = (collision.transform.position - transform.position).normalized * hited;
			collision.gameObject.rigidbody.AddForce (v);
		} else if (collision.gameObject.name == "FallingCollider") {
			playerFall(myName);
		}

	}	

	public void playerFall(string name) {
		if (isAdmin) {
			game.playerFall (name);
			sendPoints();
		}
	
		resetPlayers ();
	}

	public void resetPlayers() {
		if (PlayGamesPlatform.Instance.RealTime.GetConnectedParticipants()[0].ParticipantId == myself.ParticipantId) {
			transform.position = new Vector3(-4,5,-4);
			opponent.transform.position = new Vector3(4,5,4);
		} else {
			transform.position = new Vector3(4,5,4);
			opponent.transform.position = new Vector3(-4,5,-4);
		}
		rigidbody.velocity = Vector3.zero;
		rigidbody.rotation = new Quaternion ();
		opponent.rigidbody.velocity = Vector3.zero;
		opponent.rigidbody.rotation = new Quaternion ();
	}


	/*
	void OnControllerColliderHit(ControllerColliderHit hit){
		Debug.Log("Object hit");
		
		// Get the hit rigidbody (if there is one).
		Rigidbody body = hit.rigidbody;
		
		// no rigidbody
		if (body == null || body.isKinematic)
			return;
		
		// We dont want to push objects below us
		if (hit.moveDirection.y < -0.3) 
			return;
		
		// Calculate push direction from move direction, 
		// we only push objects to the sides never up and down
		Vector3 pushDir = new Vector3(hit.moveDirection.x, 0, hit.moveDirection.z);
		
		// Apply the push
		body.AddForceAtPosition( pushDir * pushPower, hit.point, forceMode );
		
	}*/

		
	public void sendMessage(byte[] message) {
		bool reliable = false;
		PlayGamesPlatform.Instance.RealTime.SendMessageToAll(reliable, message);
	}


	public void sendToAdmin(float joyX, float joyY) {
		byte[] bytes = new byte[12];
		BitConverter.GetBytes (MainObject.USER_JOY).CopyTo (bytes, 0);
		BitConverter.GetBytes (joyX).CopyTo (bytes, 4);
		BitConverter.GetBytes (joyY).CopyTo (bytes, 8);

		PlayGamesPlatform.Instance.RealTime.SendMessageToAll(false, bytes);
	}

	public void sendToUser() {
		byte[] bytes = new byte[60];
		BitConverter.GetBytes (MainObject.POSITION_UPDATE).CopyTo (bytes, 0);
		BitConverter.GetBytes (transform.position.x).CopyTo (bytes, 4);
		BitConverter.GetBytes (transform.position.y).CopyTo (bytes, 8);
		BitConverter.GetBytes (transform.position.z).CopyTo (bytes, 12);
		BitConverter.GetBytes (transform.rotation.x).CopyTo (bytes, 16);
		BitConverter.GetBytes (transform.rotation.y).CopyTo (bytes, 20);
		BitConverter.GetBytes (transform.rotation.z).CopyTo (bytes, 24);
		BitConverter.GetBytes (transform.rotation.w).CopyTo (bytes, 28);
		BitConverter.GetBytes (opponent.transform.position.x).CopyTo (bytes, 32);
		BitConverter.GetBytes (opponent.transform.position.y).CopyTo (bytes, 36);	
		BitConverter.GetBytes (opponent.transform.position.z).CopyTo (bytes, 40);	
		BitConverter.GetBytes (opponent.transform.rotation.x).CopyTo (bytes, 44);
		BitConverter.GetBytes (opponent.transform.rotation.y).CopyTo (bytes, 48);
		BitConverter.GetBytes (opponent.transform.rotation.z).CopyTo (bytes, 52);	
		BitConverter.GetBytes (opponent.transform.rotation.w).CopyTo (bytes, 56);		
		
		PlayGamesPlatform.Instance.RealTime.SendMessageToAll(false, bytes);
	}

	public void sendPoints() {
		byte[] bytes = new byte[12];
		BitConverter.GetBytes (MainObject.POINTS).CopyTo (bytes, 0);
		BitConverter.GetBytes (game.player1Points).CopyTo (bytes, 4);
		BitConverter.GetBytes (game.player1Points).CopyTo (bytes, 8);		
		
		PlayGamesPlatform.Instance.RealTime.SendMessageToAll(false, bytes);
	}
}


public class MultiListener : RealTimeMultiplayerListener {
	private SphereMoveCS playerController;
	public MultiListener(SphereMoveCS playerController) {
		this.playerController = playerController;
	}
	
	public void OnRoomConnected(bool success) {
		if (success) {
			playerController.myself = PlayGamesPlatform.Instance.RealTime.GetSelf();
			playerController.isAdmin = PlayGamesPlatform.Instance.RealTime.GetConnectedParticipants()[0].ParticipantId == playerController.myself.ParticipantId;
			playerController.resetPlayers();
			playerController.game.playing = true;
		} 
	}	
	
	public void OnRealTimeMessageReceived(bool isReliable, string senderId, byte[] data) {
		float type = BitConverter.ToSingle (data, 0);
		if (type == MainObject.USER_JOY && playerController.isAdmin) {
			playerController.opponentMovementX = BitConverter.ToSingle (data, 4);
			playerController.opponentMovementY = BitConverter.ToSingle (data, 8);
		} else if (type == MainObject.POSITION_UPDATE) {
			float posX = BitConverter.ToSingle (data, 4);
			float posY = BitConverter.ToSingle (data, 8);
			float posZ = BitConverter.ToSingle (data, 12);
			float rotX = BitConverter.ToSingle (data, 16);
			float rotY = BitConverter.ToSingle (data, 20);
			float rotZ = BitConverter.ToSingle (data, 24);
			float rotW = BitConverter.ToSingle (data, 28);
			float pos2X = BitConverter.ToSingle (data, 32);
			float pos2Y = BitConverter.ToSingle (data, 36);
			float pos2Z = BitConverter.ToSingle (data, 40);		
			float rot2X = BitConverter.ToSingle (data, 44);
			float rot2Y = BitConverter.ToSingle (data, 48);
			float rot2Z = BitConverter.ToSingle (data, 52);
			float rot2W = BitConverter.ToSingle (data, 56);	

			playerController.opponentPosition = (new Vector3 (posX, posY, posZ));
			playerController.opponentRotation = new Quaternion (rotX, rotY, rotZ, rotW);
			playerController.myPosition = new Vector3 (pos2X, pos2Y, pos2Z);
			playerController.myRotation = new Quaternion (rot2X, rot2Y, rot2Z, rot2W);
		} else if (type == MainObject.POINTS) {
			playerController.game.player1Points = (int) BitConverter.ToSingle (data, 4);
			playerController.game.player2Points = (int) BitConverter.ToSingle (data, 8);
			playerController.game.updatePoints();
		}
	}	
	
	public void OnPeersDisconnected(string[] participantIds) {
	}
	
	public void OnRoomSetupProgress(float progress) {
		
	}
	
	public void OnLeftRoom() {
	}
	
	public void OnPeersConnected(string[] peers){
	}
}

