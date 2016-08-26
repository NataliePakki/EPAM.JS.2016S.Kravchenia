Zombie.michael = function(config) { 
    var base = Zombie.call(this, config);
    base.$element.addClass("michael");
    base.health = 70;
    base.maxHealth = 70;
    base.speed = 2;
};