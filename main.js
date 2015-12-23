

// function GameSave() {

// }


// window.onload = function() {
// 	window.game = new GameSave();
// };








var seed = {
	amount: 0,
	rate: 1
};

function seedCollect(number) {
	seed.amount = seed.amount + number;
	updateResources();
};



var sparrow = {
	amount: 0,
	cost: 5,
	rate: 0
};

function buySparrow(num) {
	if (seed.amount >= sparrow.cost * num) {
		sparrow.amount = sparrow.amount + num;
		seed.amount = seed.amount - sparrow.cost * num;
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
	document.getElementById("seed").innerHTML = addSuffix(seed.amount);
	document.getElementById("sparrow").innerHTML = addSuffix(sparrow.amount);
};

function updateRates() {
	seed.rate = sparrow.amount + 1;
	document.getElementById("seedRate").innerHTML = addSuffix(seed.rate);
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
	seedCollect(seed.rate);
}, 1000);		// fires every 1000ms




function updateLog(string){
	var oldlog = document.getElementById("log").innerHTML;
	document.getElementById("log").innerHTML = string + "<br>" + oldlog;
}

function clearLog() {
	document.getElementById("log").innerHTML = ">>";
}



