#pragma strict

var selectedCharacter : int = 0;

function Start () {

}

function Update () {
	if(Input.GetMouseButtonUp (0)){
		var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit : RaycastHit;
		
		if(Physics.Raycast (ray, hit, 100)){
			if(hit.collider.name == "Character1"){
				Debug.Log("Character1 selected");
				selectedCharacter = 1;
				PlayerPrefs.SetInt("selectedCharacter", (selectedCharacter));
			}
			if(hit.collider.name == "Character2"){
				Debug.Log("Character2 selected");
				selectedCharacter = 2;
				PlayerPrefs.SetInt("selectedCharacter", (selectedCharacter));
			}
			if(hit.collider.name == "Character3"){
				Debug.Log("Character3 selected");
				selectedCharacter = 3;
				PlayerPrefs.SetInt("selectedCharacter", (selectedCharacter));
			}
		}else{
			return;
		}
	
	}

}