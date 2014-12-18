using UnityEngine;
using System.Collections;

public class Opponent : MonoBehaviour {

	public SphereMoveCS player;
	private string myName = "player2";

	void Start () {
		
	}

	void Update () {
	}
	
	void FixedUpdate() {
	}

	void OnCollisionEnter(Collision collision) {
		//1.Version static speed 
		if (collision.gameObject.name == "Opponent") {
			Vector3 v = (collision.transform.position - transform.position).normalized * player.hited;
			collision.gameObject.rigidbody.AddForce (v);
		} else if (collision.gameObject.name == "FallingCollider") {
			player.playerFall(myName);
		}
		
	}	
}
