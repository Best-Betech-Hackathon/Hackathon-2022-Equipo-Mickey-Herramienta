importScripts('lib/tank.js');


var tiempoGirar;

function dispararEnemigo(state, control) {

	let enemy = state.radar.enemy;
	if (!enemy){return;}

	let velocidadBala = 4;
	let distancia = Math.distance(state.x, state.y, enemy.x, enemy.y)
	//control.RADAR_TURN = 0;

	//Predecir Posición
	let tiempoBala = distancia / velocidadBala;
	let targetX = enemy.x + tiempoBala * enemy.speed * Math.cos(Math.deg2rad(enemy.angle));
	let targetY = enemy.y + tiempoBala * enemy.speed * Math.sin(Math.deg2rad(enemy.angle));

	//Apuntar
	let anguloObjetivo = Math.deg.atan2(targetY - state.y, targetX - state.x);
	let anguloArma = Math.deg.normalize(anguloObjetivo - state.angle);
	let anguloArmaDif = Math.deg.normalize(anguloArma - state.gun.angle);
	control.GUN_TURN = 0.3 * anguloArmaDif;

	//Disparar
	if(Math.abs(anguloArmaDif) < 1) { control.SHOOT = 0.2;}

}

function buscarEnemigo (state, control){
	if(!state.radar.enemy) { 
		// Gira el radar
  	control.RADAR_TURN = 1;
	control.GUN_TURN = 0;
  } else{
  	// Mantener al enemigo en el haz
  	let anguloObjetivo = Math.deg.atan2(state.radar.enemy.y - state.y, state.radar.enemy.x - state.x);
  	let anguloRadar = Math.deg.normalize(anguloObjetivo - state.angle);
		let anguloRadarDif = Math.deg.normalize(anguloRadar - state.radar.angle);
		control.RADAR_TURN = anguloRadarDif;
  }
}

function seguirEnemigo(state, control) {
  let enemy = state.radar.enemy;
	if (!enemy){return;}

	//Giramos hasta el objetivo
	let anguloObjetivo = Math.deg.atan2(state.radar.enemy.y - state.y, state.radar.enemy.x - state.x);
	let anguloCuerpoDif = Math.deg.normalize(anguloObjetivo - state.angle);
	//control.TURN = 0.5 * anguloCuerpoDif

	//movemos manteniendo la distancia
	let distancia = Math.distance(state.x, state.y, state.radar.enemy.x, state.radar.enemy.y)
	let distanciaDif = distancia - 150;
	control.THROTTLE = (distanciaDif/50);
  // control.TURN = 1
  var enemyAngle = Math.deg.atan2(
      state.radar.enemy.y - state.y,
      state.radar.enemy.x - state.x
    )
    // cal
  bodyAngleDelta = Math.deg.normalize(enemyAngle - 90 - state.angle);
   if(Math.abs(bodyAngleDelta) > 90) bodyAngleDelta += 180;
   control.TURN = bodyAngleDelta * 0.2;

}

function huirEnemigo(state, control) {
  let enemy = state.radar.enemy;
	if (!enemy){return;}

	//Giramos hasta el objetivo
	let anguloObjetivo = Math.deg.atan2(state.radar.enemy.y - state.y, state.radar.enemy.x - state.x);
	let anguloCuerpoDif = Math.deg.normalize(anguloObjetivo - state.angle);
	
  //Que gire el cuerpo en dirección de el enemigo
	control.TURN = anguloCuerpoDif;
  
	//movemos manteniendo la distancia
	let distancia = Math.distance(state.x, state.y, state.radar.enemy.x, state.radar.enemy.y)
	// let distanciaDif = distancia - 150;
	// control.THROTTLE = - (distanciaDif/100);
	control.THROTTLE = -1
}

function choquePared(state, control){
	if (state.collisions.wall){
  	tiempoGirar = 10;
    control.BOOST = 1;
  } 
  if (tiempoGirar>0){
 		tiempoGirar--;
    control.TURN=1;
  }else{
  	control.TURN= 0;
  }
  
}

tank.init(function(settings, info) {
  tiempoGirar = 0;
});

tank.loop(function(state, control) {
  choquePared(state, control);
	buscarEnemigo(state, control);
	dispararEnemigo(state, control);
	seguirEnemigo(state, control);
});


