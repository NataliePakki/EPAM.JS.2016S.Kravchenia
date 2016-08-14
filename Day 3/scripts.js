
$(function () {
	function random (min, max) {
		return Math.floor((Math.random() * max) + min);
	}

	var buttonGenerate = $('#button-generate');
	var buttonSetColor = $('#button-set-color');
	var buttonReset = $('#button-reset');

	var container = $(".container");

 	function lock (button){
 		button.addClass("locked");
 	}
 	function unlock (button){
 		button.removeClass("locked");
 	}
 	function clearField (){
 		container.empty();
 	}

	buttonGenerate.on ("click", function () {
		clearField();
		for (var i = 0; i < random(50,72); i++) {
			var number = random(1,100);
			container.append("<div class = 'cell'>" + number + "</div>");
		}
		lock(buttonGenerate);
		unlock(buttonSetColor);	
		unlock(buttonReset);	
	})

	buttonReset.on ("click", function () {
		clearField();
		unlock(buttonGenerate);
		lock(buttonSetColor);
		lock(buttonReset);
	})

	buttonSetColor.on ("click", function () {
		$.each($(".cell"), function(i, val) {
			var cell = $( this );
			var cellVal = cell.text();
			if(cellVal > 75)
				cell.addClass("red");
			else if(cellVal > 50)
				cell.addClass("orange");
			else if(cellVal > 25)
				cell.addClass("green");
		});

		lock(buttonSetColor);		
	})
});
