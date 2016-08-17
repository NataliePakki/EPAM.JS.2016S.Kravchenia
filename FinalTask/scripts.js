$(function () {
	var $resources = ["cheese","orange","cherry","pumpkin"];
	var $bomb = "bomb";
	var $countResources = $resources.length - 1;
	
	var $button = $("#button");
	
	var $resourceCost = 1;
	var $bombCost = 10;
	
	var $field =  $(".center.field");
	
	var $gameIsStarted = false;
	
	var $widthResource = 70;
	var $heightResource = 70;
	
	var $timeAppearResource = 500; //1000;
	var $timeHideResource = 700;   //1000;
	
	var $timeAppearBomb = 5000;
    var $timeHideBomb = 2000;
		
	var $timerResourceID;
	var $timerBombID;
    
	var $maxX= $field.width() - $widthResource;
	var $maxY = $field.height() - $heightResource;	

	function random (min, max) {
		return Math.round(min + Math.random () * (max - min));
	}

	function getRandomResource () {
		return $resources[random(0, $countResources)];
	}
	
	function getRandomXPosition () {
		return random(0, $maxX) + "px";
	}
	function getRandomYPosition () {
		return random(0, $maxY) + "px";
	}
	function getResourcePointsElement(resource) {
		return $("." + resource + ".element .count");
	}
	
	// amt       -  how much points.
	// resource  - 	what resource.
	function increasePoints (amt, resource) {
		var resourcePointsElement =  getResourcePointsElement(resource);
		var resourcePoints = resourcePointsElement.html();
		
		if (resourcePoints === "-") {
			resourcePointsElement.html("1");
		}
		else {
			resourcePointsElement.html((+resourcePoints + amt));
		}
	}
	// amt       -  how much points.
	// resource  - 	what resource.
	function descreasePoints (amt) {
		var resource = getRandomResource();
		var resourcePointsElement =  getResourcePointsElement(resource);
		var resourcePoints = resourcePointsElement.html();
		
		if (resourcePoints === "-") {
			return;
		}
		
		var points = +resourcePoints - amt;
		if (points <= 0) {
			resourcePointsElement.html("-");
		}
		else {
			resourcePointsElement.html(points);
		}
	}
	
	function addClickEvent (resource) {
		resource.on("click",function () {
			var $this = $(this);
			$this.stop();
			var resourceName = this.className.split(" ")[0];
			if (resourceName !== "bomb") {
				increasePoints($resourceCost, resourceName);
			}
			else {
				$this.stop();
			}
			$this.remove();
		});
	}
	
	function setDisappearing (resource) {
		if (!resource.hasClass($bomb)) {
			resource.fadeIn($timeHideResource, function () {
				var $this = $(this);
				$this.remove();
			});
		} else {
			resource.fadeIn($timeHideBomb, function () {
				var $this = $(this);
				descreasePoints($bombCost);	
				$this.remove();
			});
		}
	}

	function createElement (element) {
		var coordinates = {
			top : getRandomYPosition(),
			left : getRandomXPosition()
		};
		
		var element = $("<div class = '" + element + " resource'></div>").hide().appendTo($field).css(coordinates);
		
		addClickEvent(element);
		setDisappearing(element);
	}
	
	function createResourse () {
		var resource = getRandomResource();
		createElement(resource);		
	}
	
	function createBomb () {
		createElement($bomb);
	}
	
	function appearResources () {
		createResourse();
		$timerResourceID = window.setTimeout(appearResources, $timeAppearResource);
	}
	function appearBombs () {
		createBomb();
		$timerBombID = window.setTimeout(appearBombs, $timeAppearBomb);
	}
	function start () {
		$gameIsStarted = true;
		$button.text("Stop");
		$.each($(".resource"), function () {
			var $this = $(this);
			setDisappearing($this);
		});
		appearResources();
		appearBombs();
	}
	
	function stop () {
		$gameIsStarted = false;	
		
		$button.text("Start");
		$(".resource").stop();
		
		window.clearTimeout($timerResourceID);
		window.clearTimeout($timerBombID);
	}
		
	$button.on("click", function () {
		if($gameIsStarted === true)
			stop();
		else 
			start();
	})

})