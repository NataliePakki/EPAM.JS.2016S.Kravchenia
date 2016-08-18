for (var i = 1; i <= 3; i++) {
    var count = 0;
    var currFunc = "getCount" + i;
    for (var j = 0; j < 5; j++) {
        if (currFunc in array[j])
            count += array[j][currFunc]();
    }
    console.log("count" + i + " = " + count);
}