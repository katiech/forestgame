

// function GameSave() {

// }


// window.onload = function() {
// 	window.game = new GameSave();
// };





// C U R R E N C I E S

var seed = {
	amount: 0,
	rate: 1
};
function seedCollect(number) {
	seed.amount = seed.amount + number;
};

var gold = {
	amount: 0,
	rate: 0
}
function goldCollect(number) {
	gold.amount = gold.amount + number;
};



// A N I M A L  F R I E N D S

var sparrow = {
	amount: 0,
	cost: 5,
	rate: 0, 		// Rate sparrows are being increased.
	seedRate: 1 	// Rate of seed gained per sparrow.
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


var magpie = {
	amount: 0,
	cost: 100,
	rate: 0,
	seedRate: 10,
	goldRate: 0.1
};
function buyMagpie(num) {
	if (seed.amount >= magpie.cost * num) {
		magpie.amount = magpie.amount + num;
		seed.amount = seed.amount - magpie.cost * num;
		updateResources();
		updateRates();
		updateCosts();
		if (num > 1) {
			updateLog("You have befriended " + num + " magpies! Wow!");
		} else {
			updateLog("You have befriended a magpie.");
		}
	} else {
		updateLog("You don't have enough seeds to befriend any magpies!");
	};
};







function updateResources() {
	document.getElementById("seed").innerHTML = addSuffix(seed.amount);
	document.getElementById("gold").innerHTML = addSuffix(gold.amount);
	document.getElementById("sparrow").innerHTML = addSuffix(sparrow.amount);
	document.getElementById("magpie").innerHTML = addSuffix(magpie.amount);
};

function updateRates() {
	seed.rate = 	sparrow.amount * sparrow.seedRate +
					magpie.amount * magpie.seedRate + 1;
	gold.rate = 	magpie.amount * magpie.goldRate;
	document.getElementById("seedRate").innerHTML = addSuffix(seed.rate);
	document.getElementById("goldRate").innerHTML = addSuffix(gold.rate);
};

function updateCosts() {
	sparrow.cost = Math.floor(5 * Math.pow(1.1, sparrow.amount));
	magpie.cost = Math.floor(100 * Math.pow(1.1, magpie.amount));
	document.getElementById("sparrowCost").innerHTML = addSuffix(sparrow.cost);
	document.getElementById("magpieCost").innerHTML = addSuffix(magpie.cost);
};




function addSuffix(resource) {
	// Forces floats to always display to 2 decimal places. Makes sure zero says 0 and not 0.00.
	if (resource < 1 && resource != 0) {
		return resource.toFixed(2);
	// Truncates large values and tacks on a suffix.
	} else {
		var suffixes = ["K","M","B","T","Qa","Qt","Sx","Sp","Oc","Dc"];
		for (var i = suffixes.length - 1; i >= 0; i--) {
			if (resource >= Math.pow(1000, i + 1)) {
				return (resource / Math.pow(1000, i + 1)).toFixed(2) + suffixes[i];
			};
		};
		return resource;
	};
};





window.setInterval(function() {
	seedCollect(seed.rate);
	goldCollect(gold.rate);
	updateResources();
}, 1000);		// fires every 1000ms




function updateLog(string){
	var oldlog = document.getElementById("log").innerHTML;
	document.getElementById("log").innerHTML = string + "<br>" + oldlog;
}

function clearLog() {
	document.getElementById("log").innerHTML = ">>";
}



