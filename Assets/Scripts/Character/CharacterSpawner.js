#pragma strict

var character01Prefab : GameObject;
var character02Prefab : GameObject;
var character03Prefab : GameObject;

var savedPlayer : int = 0;

//runs before start
function Awake(){

	savedPlayer = PlayerPrefs.GetInt("selectedCharacter");
	
	character01Prefab = GameObject.Find("Character1");
	character02Prefab = GameObject.Find("Character2");
	character03Prefab = GameObject.Find("Character3");
	
	switch(savedPlayer){
		case 0:
			character01Prefab.SetActiveRecursively(true);
			character02Prefab.SetActiveRecursively(false);
			character03Prefab.SetActiveRecursively(false);
			break;
		case 1:
			character01Prefab.SetActiveRecursively(true);
			character02Prefab.SetActiveRecursively(false);
			character03Prefab.SetActiveRecursively(false);
			break;
		case 2:
			character01Prefab.SetActiveRecursively(false);
			character02Prefab.SetActiveRecursively(true);
			character03Prefab.SetActiveRecursively(false);
			break;
		case 3:
			character01Prefab.SetActiveRecursively(false);
			character02Prefab.SetActiveRecursively(false);
			character03Prefab.SetActiveRecursively(true);
			break;			
	}

}