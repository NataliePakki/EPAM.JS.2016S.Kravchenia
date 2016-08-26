Zombie = function (config) { 
    var zombie = {
        health : 50,
        speed : 1,
        $line : config.$line,
        currPosition : config.startPosition,
        endPosition : config.endPosition,
        isDead : false,
        $element : $("<div class='zombie'></div>"),
        maxHealth : 50,
        tempSpeed : 0
    };

    
    this.isDead = function () {
        return zombie.isDead;
    }
    this.move = function() {
        zombie.currPosition += zombie.speed;
        if(zombie.currPosition < zombie.endPosition) {
            zombie.$element.css('right', zombie.currPosition);
        }
        else {
            zombie.notify();
        }
    };

    this.die = function() {
        zombie.isDead = true;
        this.unsubscribe();
        zombie.$element.remove();
    };
    
    this.slow = function (speed) {
		zombie.tempSpeed = zombie.speed;
		zombie.speed = speed;
	}
	
	this.returnSpeed = function() {
        zombie.speed = zombie.tempSpeed;
	}
    
    this.subscribe = function(func) {
        zombie.notify = func;
    };
        
    this.unsubscribe = function() {
        zombie.notify = undefined;
    };
    
    this.hit = function(damage) {
        zombie.health -= damage;
        if(zombie.health <= 0) {
            this.die();
        }
        else {
            var pr = Math.round((zombie.health * 100) / zombie.maxHealth);
			zombie.$element.text(pr + '%');
        }
    }
    
    zombie.$element.css('right', zombie.currPosition);
    zombie.$element.text('100%').css('color', 'red');
    $(zombie.$line).append(zombie.$element);

    return zombie;
}