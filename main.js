


var seed = 0;
var initialRate = 1;
var seedRate = initialRate;

function seedCollect(number) {
	seed = seed + number;
	updateResources();
};



var sparrow = {
	amount:0,
	cost:5,
	rate:1
};

function buySparrow(num) {
	if (seed >= sparrow.cost * num) {
		sparrow.amount = sparrow.amount + num;
		seed = seed - sparrow.cost * num;
		updateResources();
		updateRates();
		updateCosts();
		if (num > 1) {
			updateLog("You have befriended " + num + " sparrows! Wow!");
		} else {
			updateLog("You have befriended a sparrow.");
		}
	} else {
		updateLog("You don't have enough seeds to befriend any sparrows!");
	};
};




function updateResources() {
	document.getElementById("seed").innerHTML = addSuffix(seed);
	document.getElementById("sparrow").innerHTML = addSuffix(sparrow.amount);
};

function updateRates() {
	seedRate = sparrow.amount*sparrow.rate + initialRate;
	document.getElementById("seedRate").innerHTML = addSuffix(seedRate);
};

function updateCosts() {
	sparrow.cost = Math.floor(10 * Math.pow(1.1, sparrow.amount));
	document.getElementById("sparrowCost").innerHTML = addSuffix(sparrow.cost);
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



