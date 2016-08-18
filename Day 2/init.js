var array = [];
for (var i = 0; i < 5; i++){
	var type = random(1,3);
	var count = random(1,10);
	array[i] = {};
	array[i].count = count;
	array[i]["getCount" + type] = function () { return this.count };

    console.log("type = " + type + ", count = " + count);
}