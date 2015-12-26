

function GameSave() {
	var save = {
		seed: seed,
		gold: gold,
		sparrow: sparrow,
		magpie: magpie
	};
	localStorage.setItem("save", JSON.stringify(save));
	updateLog("Game Saved!");
};

function GameLoad() {
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (savegame !== null) {
		if (typeof savegame.seed !== "undefined") seed = savegame.seed;
		if (typeof savegame.gold !== "undefined") gold = savegame.gold;
		if (typeof savegame.sparrow !== "undefined") sparrow = savegame.sparrow;
		if (typeof savegame.magpie !== "undefined") magpie = savegame.magpie;
		updateLog("Game Loaded!");
		updateAll();
	} else {
		updateLog("There is no existing game file!");
	};
};

function GameDelete() {
	localStorage.removeItem("save");
	// also set everything to zero????????? reset function?????
};


// Auto loads if save file present.
window.onload = function() {
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (typeof savegame !== "undefined") {
		GameLoad();
	};
};




// C E N T E R  N A V

function show1() {
   document.getElementById('center1').style.display = "block";
   document.getElementById('center2').style.display = "none";
   document.getElementById('center3').style.display = "none";
};

function show2() {
   document.getElementById('center2').style.display = "block";
   document.getElementById('center1').style.display = "none";
   document.getElementById('center3').style.display = "none";
};

function show3() {
   document.getElementById('center3').style.display = "block";
   document.getElementById('center1').style.display = "none";
   document.getElementById('center2').style.display = "none";
};




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

var acorn = {
	amount: 0,
	rate: 0
};
function acornCollect(number) {
	acorn.amount = acorn.amount + number;
};



// A N I M A L  F R I E N D S

var sparrow = {
	name: 'sparrow',
	plural: 'sparrows',
	amount: 0,
	cost: 5,		// seeds
	rate: 0, 		// Rate sparrows are being increased.
	seedRate: 1 	// Rate of seed gained per sparrow.
};

var magpie = {
	name: 'magpie',
	plural: 'magpies',
	amount: 0,
	cost: 100, 		// seeds
	rate: 0,
	seedRate: 10,
	goldRate: 0.1
};

var squirrel = {
	name: 'squirrel',
	plural: 'squirrels',
	amount: 0,
	cost: 10000, 	// seeds
	rate: 0,
	seedRate: 1000,
	acornRate: 0.1
};

function buyAnimal(animal, num) {
	if (seed.amount >= animal.cost * num) {
		animal.amount = animal.amount + num;
		seed.amount = seed.amount - animal.cost * num;
		updateResources();
		updateRates();
		updateCosts();
		if (num > 1) {
			updateLog("You have befriended " + num + " " + animal.plural + "! Wow!");
		} else {
			// Do something about a or an?????
			updateLog("You have befriended a " + animal.name + ".");
		};
	} else {
		if (num > 1) {
			updateLog("You don't have enough seeds to befriend " + num + " " + animal.plural + ".");
		} else {
			// Do something about a or an?????
			updateLog("You don't have enough seeds to befriend a " + animal.name + ".");
		};
	};
};




function setBuy(num) {
	// Bold selected and unbold everything else.
	var buyNums = [1, 10, 25, 100];
	for (b = 0; b < buyNums.length; b++) { 
		document.getElementById("buy" + buyNums[b]).setAttribute("class", "unbold");
	}
	document.getElementById("buy" + num).setAttribute("class", "bold");

	// Fix displayed cost values.
	document.getElementById("sparrowCost").innerHTML = fixValue(sparrow.cost * num);
	document.getElementById("magpieCost").innerHTML = fixValue(magpie.cost * num);
	document.getElementById("squirrelCost").innerHTML = fixValue(squirrel.cost * num);

	// Change "onclick" for the buttons.
	document.getElementById("buySparrow").setAttribute("onclick", "buyAnimal(sparrow, " + num + ")");
	document.getElementById("buyMagpie").setAttribute("onclick", "buyAnimal(magpie, " + num + ")");
	document.getElementById("buySquirrel").setAttribute("onclick", "buyAnimal(squirrel, " + num + ")");
};



function updateResources() {
	document.getElementById("seed").innerHTML = fixValue(seed.amount);
	document.getElementById("gold").innerHTML = fixValue(gold.amount);
	document.getElementById("acorn").innerHTML = fixValue(acorn.amount);
	document.getElementById("sparrow").innerHTML = fixValue(sparrow.amount);
	document.getElementById("magpie").innerHTML = fixValue(magpie.amount);
	document.getElementById("acorn").innerHTML = fixValue(acorn.amount);
};

function updateRates() {
	seed.rate = 	sparrow.amount * sparrow.seedRate +
					magpie.amount * magpie.seedRate +
					squirrel.amount * squirrel.seedRate +
					1;
	gold.rate = 	magpie.amount * magpie.goldRate;
	acorn.rate = 	squirrel.amount * squirrel.acornRate;
	document.getElementById("seedRate").innerHTML = fixValue(seed.rate);
	document.getElementById("goldRate").innerHTML = fixValue(gold.rate);
	document.getElementById("acornRate").innerHTML = fixValue(acorn.rate);
};

function updateCosts() {
	sparrow.cost = Math.floor(5 * Math.pow(1.1, sparrow.amount));
	magpie.cost = Math.floor(100 * Math.pow(1.1, magpie.amount));
	squirrel.cost = Math.floor(10000 * Math.pow(1.1, squirrel.amount));
	document.getElementById("sparrowCost").innerHTML = fixValue(sparrow.cost);
	document.getElementById("magpieCost").innerHTML = fixValue(magpie.cost);
	document.getElementById("squirrelCost").innerHTML = fixValue(squirrel.cost);
};

function updateAll(){
	updateResources();
	updateRates();
	updateCosts();
};




function fixValue(resource) {
	// Forces floats to always display to 2 decimal places if < 1. Makes sure zero says 0 and not 0.00.
	if (resource != 0) {
		if (resource >= 1) {
			resource = resource.toFixed(0);
		} else {
			resource = resource.toFixed(2);
		};
	};
	// Truncates large values and tacks on a suffix.
	var suffixes = ["K","M","B","T","Qa","Qt","Sx","Sp","Oc","Dc"];
	for (var i = suffixes.length - 1; i >= 0; i--) {
		if (resource >= Math.pow(1000, i + 1)) {
			return (resource / Math.pow(1000, i + 1)).toFixed(2) + suffixes[i];
		};
	};
	return resource;
};





window.setInterval(function() {
	seedCollect(seed.rate);
	goldCollect(gold.rate);
	acornCollect(acorn.rate);
	updateResources();
}, 1000);		// fires every 1000ms




function updateLog(string){
	var oldlog = document.getElementById("log").innerHTML;
	document.getElementById("log").innerHTML = string + "<br>" + oldlog;
}

function clearLog() {
	document.getElementById("log").innerHTML = ">>";
}



