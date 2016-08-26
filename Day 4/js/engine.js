$(function () {
	var $fieldLines = $(".field-line");
	var $gameOver = $(".game-over");
	
	var $btnGenerate = $("#btnGenerate");
	var $btnStart = $("#btnStart");
	var $btnSlowUp = $("#btnSlowUp");
	var $btnGrowOld = $("#btnGrowOld");
	var $btnExplode = $("#btnExplode");
	
	function randomLine () {
		return  $fieldLines[random(0, $fieldLines.length - 1)];
	}
	
	var zombieTypes = [Zombie.strong, Zombie.michael];
	var zombies = [];
	var zombieConfig = {
		startPosition : 0,
		endPosition : 860
	};	
	
	var isGameStarted = false;
	
	var growOldEffectConfig = {
		name :  $btnGrowOld.html(),
		$button : $btnGrowOld,
		time : 10000,
		disableTime : 3000,
		func : function() { damageAllZombies(1); },
		stopFunc : function () {}
	};
	
	var slowUpEffectConfig = {
		name : $btnSlowUp.html(),
		$button : $btnSlowUp,
		time : 10000,
		disableTime : 3000,
		func : function() { slowUpAllZombies(); },
		stopFunc : setNormalSpeed
	};
	
	var explodeEffectConfig = {
		name : $btnExplode.html(),
		$button : $btnExplode,
		time : 1000,
		disableTime : 5000,
		func : function () { damageAllZombies(15); },
		stopFunc : function () {}
	};
	
	var timerMoveID;
	var timerGenerateID;
	
	var timers = [];
	
	var baseZombie = new Zombie(zombieConfig);
	
	function random (min, max) {
		return Math.round(min + Math.random () * (max - min));
	}
	
	function randomZombie () {
		zombieConfig.$line = randomLine();
		var zombie = new zombieTypes[random(0, zombieTypes.length - 1)](zombieConfig);
		zombie.subscribe(gameIsOver);
		return zombie;
	}

	function gameReset () {
		isGameStarted = false;
		$btnStart.text("Start");
		
		enable($btnGenerate);
		
		clearTimeout(timerMoveID);
		clearTimeout(timerGenerateID);
		
		for(var i = 0; i < timers.length; i ++ ) {
			clearInterval(timers[i]);
		}
		
		disable($btnGrowOld);
		disable($btnSlowUp);
		disable($btnExplode);
		
		deleteEffect($btnGrowOld);
		deleteEffect($btnSlowUp);
		
		$btnExplode.html(explodeEffectConfig.name);
		$btnGrowOld.html(growOldEffectConfig.name);
		$btnSlowUp.html(slowUpEffectConfig.name);
		
		for (var i = 0; i < zombies.length; i++) {
			zombies[i].die();
		}    
		
		zombies = [];
	}
	
	function gameIsOver () {
		gameReset();
		$gameOver.css("display", "block");
	}
		
	function moveZombies () {
		for (var i = 0; i < zombies.length; i++) {
				zombies[i].move();
		}
	}
	
	function setNormalSpeed () {
		for (var i = 0; i < zombies.length; i++){
			zombies[i].returnSpeed();
		}
	}
	
	function damageAllZombies (damage) {
		for (var i = 0; i < zombies.length; i ++ ){
			zombies[i].hit(damage);
			if(zombies[i].isDead()) {
				zombies.splice(i,1);
			}
		}
	}
	
	function slowUpAllZombies () {
		for (var i = 0; i < zombies.length; i++) {
			zombies[i].slow(baseZombie.speed);
		}
	}
	
	function enable($button) {
        $button.removeClass("disabled");
    }

    function disable($button) {
        $button.addClass("disabled");
    }
	
	function setEffect($button) {
		$button.addClass("effect");
	}
	
	function deleteEffect($button) {
		$button.removeClass("effect");
	}
	
	function setDisableEffect(time, $button) {
		var text = $button.html();
		var currTime = time / 1000;
		$button.html(currTime);
		disable($button);
		var timer =  setInterval( function () {
			currTime -= 1;
			$button.html(currTime);
		}, 1000);
		timers.push(timer)
		
		var timerEnable = setTimeout(function () {
			clearInterval(timer);
			timers.splice(timers.indexOf(timer), 1);
			$button.html(text);
			enable($button);
		}, time);
		
		timers.push(timerEnable);
	}

	function effect (config) { // name, $button, time, disableTime, func , stopFunc
		var $button = config.$button;
		var text = config.name;
		var time = config.time;
		var disableTime = config.disableTime;
		
		var currTime = time / 1000;
		var timerEffect = setInterval(function () {
			currTime -= 1;
			$button.html(currTime);
			config.func()
		}, 1000);
		timers.push(timerEffect);
		
		var timerStopEffect = setTimeout( function () {
			config.stopFunc();
			clearInterval(timerEffect);
			timers.splice(timers.indexOf(timerEffect), 1);
			deleteEffect($button);
			$button.html(text);
			setDisableEffect(disableTime, $button); 
		} , time);
		timers.push(timerStopEffect);
	}
	
	function isDisabled($button) {
		return $button.hasClass("disabled");
	}
	
	function generateZombie() {
		var zombie = randomZombie(); 
		zombies.push(zombie);
	}
	function generatesZombies() {
		timerGenerateID = setTimeout(function () {
			generateZombie();
			generatesZombies();
		}, random(4000,10000));
	};	
	
	$btnGenerate.on("click", function () {
		if(!isGameStarted) {
			generateZombie();
		}
	});
	
	$btnStart.on("click", function () {
		if(!isGameStarted) {
			
			isGameStarted = true;
			
			enable($btnSlowUp);
			enable($btnGrowOld);
			enable($btnExplode);
			disable($btnGenerate);
			
			$btnStart.text("Reset");
				
			timerMoveID = setInterval(moveZombies, 100);	
			generatesZombies();			
		}
		else {
			gameReset();
		}
	});
	
	$btnGrowOld.on("click", function() {
		if(!isDisabled($btnGrowOld)) {
			setEffect($btnGrowOld);
			effect(growOldEffectConfig);
		}
	});
	
	$btnSlowUp.on("click", function() {
		if(!isDisabled($btnSlowUp)) {
			setEffect($btnSlowUp);
			effect(slowUpEffectConfig);
		}
	});
	
	$btnExplode.on("click", function() {
		if(!isDisabled($btnExplode)) {
			effect(explodeEffectConfig);
		}
	})	
});