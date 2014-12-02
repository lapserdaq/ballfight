#pragma strict

/*function AreaDamageEnemies(location : Vector3, radius : float , damage : float ) { 
	var objectsInRange : Collider[] = Physics.OverlapSphere(location, radius); 
	for (var col : Collider in objectsInRange) { 
		var enemy : Enemy = col.GetComponent(Enemy); 
		if (enemy != null) { 
			// linear falloff of effect 
			var proximity : float = (location - enemy.transform.position).magnitude; 
			var effect : float = 1 - (proximity / radius);

         //enemy.ApplyDamage(damage * effect);
         Debug.Log("Object close");
     }
 }
}*/