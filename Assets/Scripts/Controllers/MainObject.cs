using UnityEngine;
using System.Collections;

public class MainObject : MonoBehaviour {
	public const float USER_JOY = 1.0f;
	public const float POSITION_UPDATE = 2.0f;
	public const float POINTS = 3.0f;

	public float timer = 300;

	public int player1Points = 0;
	public int player2Points = 0;
	private string PLAYER1_NAME = "Player1";
	private string PLAYER2_NAME = "Player2";

	public GUIText Player1Name;
	public GUIText Player1Points;
	public GUIText Player2Name;
	public GUIText Player2Points;
	public GUIText timerText;
	public GUIText winText;
	public bool playing = false;

	void Start () {
		Player1Name.text = PLAYER1_NAME;
		Player1Points.text = player1Points.ToString();
		Player2Name.text = PLAYER2_NAME;
		Player2Points.text = player2Points.ToString();
		timerText.text = "Time left: " + timer.ToString("F0"); 
		winText.text = "";
	}

	void Update () {
		if (playing) {
			timer -= Time.deltaTime; 
			timerText.text = "Time left: " + timer.ToString ("F0");

			if (timer <= 0) {
				playing = false;
				if (player1Points == player2Points) {
					winText.text = "DRAW";
				} else if (player1Points > player2Points) {
					winText.text = PLAYER1_NAME + " wins";
				} else {
					winText.text = PLAYER2_NAME + " wins";
				}
			}
		}
	
	}

	public void playerFall(string name) {
		if (name == PLAYER1_NAME) {
			player2Points++;
			Player2Points.text = player2Points.ToString();
		} else {
			player1Points++;
			Player1Points.text = player1Points.ToString();
		}
	}

	public void updatePoints() {
		Player1Points.text = player1Points.ToString();
		Player2Points.text = player2Points.ToString();
	}

}
