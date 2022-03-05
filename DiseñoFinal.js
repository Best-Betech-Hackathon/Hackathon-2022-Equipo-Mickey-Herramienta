importScripts('lib/tank.js');


var tiempoGirar;
var timer = 0;

function dispararEnemigo(state, control) {
	let enemy = state.radar.enemy;
	if (!enemy){return;}

	let velocidadBala = 4;
	let distancia = Math.distance(state.x, state.y, enemy.x, enemy.y)
	//control.RADAR_TURN = 0;
    if (distancia>100){
        let targetY=enemy.y;
        let targetX=enemy.x;
        let anguloObjetivo = Math.deg.atan2(targetY - state.y, targetX - state.x);
        let anguloArma = Math.deg.normalize(anguloObjetivo - state.angle);
        let anguloArmaDif = Math.deg.normalize(anguloArma - state.gun.angle);
        var anguloArmaDifCos = Math.deg.normalize(anguloArmaDif + 20*Math.sin(timer*2));
        control.GUN_TURN = 0.3 * anguloArmaDifCos;
        control.SHOOT = 0.1;
    }if (distancia<100 && distancia>25){
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
	control.SHOOT = 0.2;
    }else{
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
	control.SHOOT = 0.;
    }
}

function buscarEnemigo (state, control){
	if(!state.radar.enemy) { 
		// Gira el radar
  	control.RADAR_TURN = 1;
	control.GUN_TURN = 0
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

}

function huirEnemigo(state, control) {
  let enemy = state.radar.enemy;
	if (!enemy){return;}

	//Giramos hasta el objetivo
	let anguloObjetivo = Math.deg.atan2(state.radar.enemy.y - state.y, state.radar.enemy.x - state.x);
	let anguloCuerpoDif = Math.deg.normalize(anguloObjetivo - state.angle);
	
  //Que gire el cuerpo en dirección de el enemigo
  if(state.collisions.wall) {
	tiempoGirar = 10;
	}

	if (tiempoGirar > 0) {
    control.BOOST = 1
		control.TURN = 1;
		tiempoGirar--;
	} else {
		control.TURN = anguloCuerpoDif - 90;
    control.BOOST = 0
	}
	//movemos manteniendo la distancia
	let distancia = Math.distance(state.x, state.y, state.radar.enemy.x, state.radar.enemy.y)
	// let distanciaDif = distancia - 150;
	// control.THROTTLE = - (distanciaDif/100);
	control.THROTTLE = -1
}

function explorarCampo(state, control) {
  
	if (state.radar.enemy) {
	// control.THROTTLE = 0;
	return;
	} else {
    let anguloObjetivo = state.angle;
    let anguloArma = Math.deg.normalize(anguloObjetivo - state.angle);
    let anguloArmaDif = Math.deg.normalize(anguloArma - state.gun.angle);
    var anguloArmaDifCos = Math.deg.normalize(anguloArmaDif + 20*Math.sin(timer*2));
    control.GUN_TURN = 0.3 * anguloArmaDifCos;
		control.SHOOT = 0.1;
    control.THROTTLE = 1;
    control.TURN = 90;
  }

	if(state.collisions.wall) {
	tiempoGirar = 10;
	}

	if (tiempoGirar > 0) {
		control.TURN = 1;
		tiempoGirar--;
	} else {
		control.TURN = 0;
	}
}

tank.loop(function(state, control) {
  
	buscarEnemigo(state, control);
	dispararEnemigo(state, control);
	huirEnemigo(state, control);
	explorarCampo(state, control);
  timer++;
});