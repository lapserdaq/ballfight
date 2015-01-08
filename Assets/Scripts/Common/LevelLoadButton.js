//#pragma strict

function OnGUI(){

	GUI.Box(Rect(10,10,140,90), "Load Level");
	
	if(GUI.Button (Rect(20,40,120,20), "Football field")){
		Application.LoadLevel("football-field");
	}
	
	if(GUI.Button (Rect(20,70,120,20), "Football field 2")){
		Application.LoadLevel("football-field-2");
	}

}