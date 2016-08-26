Zombie.strong = function(config) {
    var base = Zombie.call(this, config);
    base.$element.addClass("strong");
    base.speed = 3;
};