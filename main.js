


var seed = 0;
var seedRate = 1;

function seedCollect(number) {
	seed = seed + number;
	updateResources();
};



var sparrow = 0;
var sparrowCost = 5;
var sparrowRate = 0;

function buySparrow() {
	if (seed >= sparrowCost) {
		sparrow = sparrow + 1;
		seed = seed - sparrowCost;
		updateResources();
		updateRates();
		updateCosts();
		updateLog("You have recruited a sparrow.");
	} else {
		updateLog("You don't have enough seeds to entice a sparrow to you!");
	};
};




function updateResources() {
	document.getElementById("seed").innerHTML = addSuffix(seed);
	document.getElementById("sparrow").innerHTML = addSuffix(sparrow);
};

function updateRates() {
	seedRate = sparrow;
	document.getElementById("seedRate").innerHTML = addSuffix(seedRate);
};

function updateCosts() {
	sparrowCost = Math.floor(10 * Math.pow(1.1, sparrow));
	document.getElementById("sparrowCost").innerHTML = addSuffix(sparrowCost);
};




function addSuffix(resource) {
	var suffixes = ["K","M","B","T","Qa","Qt","Sx","Sp","Oc","Dc"];
	for (var i = suffixes.length - 1; i >= 0; i--) {
		if (resource >= Math.pow(1000, i + 1)) {
			return (resource / Math.pow(1000, i + 1)).toFixed(2) + suffixes[i];
		};
	};
	return resource;
};





window.setInterval(function(){
	seedCollect(seedRate);
}, 1000);		// fires every 1000ms




function updateLog(string){
	var oldlog = document.getElementById("log").innerHTML;
	document.getElementById("log").innerHTML = string + "<br>" + oldlog;
}

function clearLog() {
	document.getElementById("log").innerHTML = ">>";
}



