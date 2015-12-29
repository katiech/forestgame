

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
		updateLog("There is no existing game file. Please remember to save.");
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
	if (!tableCreated) {
		gardenTable();
		tableCreated = !tableCreated;
	} if (!gardenInitialized) {
		initalizeGarden();
		gardenInitialized = !gardenInitialized;
	}
};

function show3() {
   document.getElementById('center3').style.display = "block";
   document.getElementById('center1').style.display = "none";
   document.getElementById('center2').style.display = "none";
};




// C U R R E N C I E S

var seed = {
	name: 'seed',
	plural: 'seeds',
	amount: 0,
	rate: 1
};
var gold = {
	name: 'gold',
	plural: 'gold',
	amount: 0,
	rate: 0
}
var acorn = {
	name: 'acorn',
	plural: 'acorns',
	amount: 0,
	rate: 0
};
var grass = {
	name: 'grass',
	plural: 'grass',
	amount: 0,
	rate: 0,
	// garden properties
	growthTime: 10 		// takes 10 seconds to finish growing
};
var carrot = {
	name: 'carrot',
	plural: 'carrots',
	amount: 0,
	rate: 0,
	growthTime: 20
};
var currencies = [seed, gold, acorn, grass, carrot];

function currencyCollect(currency) {
	currency.amount += currency.rate;
};



// A N I M A L  F R I E N D S

var sparrow = {
	name: 'sparrow',
	plural: 'sparrows',
	amount: 0,
	cost: [0, 5],			// seeds 0
	rate: 0, 		// Rate sparrows are being increased.
	seedRate: 1 	// Rate of seed gained per sparrow.
};
var magpie = {
	name: 'magpie',
	plural: 'magpies',
	amount: 0,
	cost: [0, 100], 		// seeds 0
	rate: 0,
	seedRate: 10,
	goldRate: 0.1
};
var squirrel = {
	name: 'squirrel',
	plural: 'squirrels',
	amount: 0,
	cost: [0, 10000], 		// seeds 0
	rate: 0,
	seedRate: 1000,
	acornRate: 0.1
};
var rabbit = {
	name: 'rabbit',
	plural: 'rabbits',
	amount: 0,
	cost: [3, 10], 			// grass 3
	rate: 0,
	seedRate: 100,
	carrotRate: 0.1
};
var otter = {
	name: 'otter',
	plural: 'otters',
	amount: 0,
	cost: [3, 100], 		// acorns 2
	rate: 0,
	seedRate: 1000,
	acornRate: 10
};
var animals = [sparrow, magpie, squirrel, rabbit, otter];

function buyAnimal(animal, num) {
	var res = currencies[animal.cost[0]]
	var val = animal.cost[1]
	if (res.amount >= val * num) {
		animal.amount += num;
		res.amount -= val * num;
		updateResources();
		updateRates();
		updateCosts();
		if (num > 1) {
			updateLog("You have befriended " + num + " " + animal.plural + "! Wow!");
		} else {
			updateLog("You have befriended " + article(animal) + ".");
		};
	} else {
		if (num > 1) {
			updateLog("You don't have enough " + res.plural + " to befriend " + num + " " + animal.plural + ".");
		} else {
			updateLog("You don't have enough " + res.plural + " to befriend " + article(animal) + ".");
		};
	};
};

function article(animal){
	if ("aeiou".indexOf(animal.name[0]) >= 0){
		return "an " + animal.name;
	} else {
		return "a " + animal.name;
    };
};

var buyAmount = 1;

function setBuy(num) {
	// Bold selected and unbold everything else.
	var buyNums = [1, 10, 25, 100];
	for (b = 0; b < buyNums.length; b++) { 
		document.getElementById("buy" + buyNums[b]).setAttribute("class", "unbold");
	}
	document.getElementById("buy" + num).setAttribute("class", "bold");
	buyAmount = num;

	for (a = 0; a < animals.length; a++) {
		// Fix displayed cost values.
		document.getElementById(animals[a].name + "Cost").innerHTML = fixValue(animals[a].cost[1] * num);
		// Change "onclick" for the buttons.
		document.getElementById("buy" + capitalize(animals[a].name)).setAttribute("onclick", "buyAnimal(" + animals[a].name + ", " + num + ")");
	}

};





function collectCurrencies() {
	for (r = 0; r < currencies.length; r++) {
		currencyCollect(currencies[r]);
	}
};

function updateResources() {
	for (r = 0; r < currencies.length; r++) {
		document.getElementById(currencies[r].name).innerHTML = fixValue(currencies[r].amount);
	}
	for (a = 0; a < animals.length; a++) {
		document.getElementById(animals[a].name).innerHTML = fixValue(animals[a].amount);
	}
};

function updateRates() {
	seed.rate = 	sparrow.amount * sparrow.seedRate +
					magpie.amount * magpie.seedRate +
					squirrel.amount * squirrel.seedRate +
					1;
	gold.rate = 	magpie.amount * magpie.goldRate;
	acorn.rate = 	squirrel.amount * squirrel.acornRate;
	for (r = 0; r < currencies.length; r++) {
		document.getElementById(currencies[r].name + "Rate").innerHTML = fixValue(currencies[r].rate);
	}
};

function updateCosts() {
	sparrow.cost[1] = Math.floor(5 * Math.pow(1.1, sparrow.amount));
	magpie.cost[1] = Math.floor(100 * Math.pow(1.1, magpie.amount));
	squirrel.cost[1] = Math.floor(10000 * Math.pow(1.1, squirrel.amount));
	for (a = 0; a < animals.length; a++) {
		console.log(animals[a].cost[1], buyAmount);
		console.log(animals[a].name + "Cost");
		document.getElementById(animals[a].name + "Cost").innerHTML = fixValue(animals[a].cost[1] * buyAmount);
	}
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

function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}




window.setInterval(function() {
	collectCurrencies();
	updateResources();
}, 1000);		// fires every 1000ms




function updateLog(string){
	var oldlog = document.getElementById("log").innerHTML;
	document.getElementById("log").innerHTML = string + "<br>" + oldlog;
}

function clearLog() {
	document.getElementById("log").innerHTML = "Log is cleared.";
}




// T H E  G A R D E N

function plot(state, id) {
	this.name = "plot" + id;
	this.state = state;			// locked, empty, growing, ready
	this.growthTime = null;
	this.crop = null; 			// holds index of type of plant; 0 if grass, 1 if carrot
}

var garden = [];
var numPlots = 16, colPlots = 4;
var tableCreated = false;
var gardenInitialized = false;

function initalizeGarden() {
	for (var i = 0; i < numPlots; i++) {
		if (i == 0) {
			garden.push(new plot(1, i));
		} else {
			garden.push(new plot(0, i));
		}
		reimagePlot(i);
	}
}

function gardenTable() {
	var rowPlots = numPlots/colPlots;
	console.log(rowPlots);
	var tbl = document.getElementById('garden');
	for (var i = 0; i < colPlots; i++) {
		var tr = tbl.insertRow();
		for (var j = 0; j < rowPlots; j++) {
			var idNum = i * rowPlots + j;
			var td = tr.insertCell();
			td.setAttribute('class', 'plot');
			// Create timer
			var timer = td.appendChild(document.createElement("DIV"));
			timer.setAttribute('id', 'plotTimer' + idNum);
			timer.setAttribute('class', 'plotTimer');
			// Create plot images
			var img = td.appendChild(document.createElement("IMG"));
			img.setAttribute('id', 'plot' + idNum);
			img.setAttribute('class', 'plant');
			img.setAttribute('onclick', 'plotAction(' + idNum + ')');
		}
	}
}

function reimagePlot(plot) {
	if (garden[plot].state == 2) {
		document.getElementById("plot" + plot).setAttribute("src", "img/" + plants[garden[plot].crop].name + "-growing.png");
	} else if (garden[plot].state == 3) {
		document.getElementById("plot" + plot).setAttribute("src", "img/" + plants[garden[plot].crop].name + "-ready.png");
	} else {
		document.getElementById("plot" + plot).setAttribute("src", "img/plot" + garden[plot].state + ".png");
	}
}

var plants = [grass, carrot];

function unlockPlot(plot) {
	garden[plot].state = 1;
	reimagePlot(plot);
	updateLog("Unlocked a plot.");
}

function plantPlot(plot) {
	var p = Math.floor(Math.random() * plants.length); 			// chooses random from list
	garden[plot].crop = p;
	garden[plot].state = 2;
	garden[plot].growthTime = plants[p].growthTime; 			// or start an event??????
	document.getElementById("plotTimer" + plot).innerHTML = secondsToTime(plants[p].growthTime);
	reimagePlot(plot);
	updateLog("Planted a " + plants[p].name + ".");
}

function plotAction(plot) {
	if (garden[plot].state == 0) {
		unlockPlot(plot);
	} else if (garden[plot].state == 1) {
		plantPlot(plot);
	}
}

function secondsToTime(seconds) {
	var hours   = Math.floor(seconds / 3600);
	var minutes = Math.floor((seconds - (hours * 3600)) / 60);
	var seconds = seconds - (hours * 3600) - (minutes * 60);
	var time = "";

	if (hours != 0) {
		time = hours + ":";
	} if (minutes != 0 || time !== "") {
		minutes = (minutes < 10 && time !== "") ? "0" + minutes : String(minutes);
		time += minutes + ":";
	} if (time === "") {
		time = seconds + "s";
    } else {
		time += (seconds < 10) ? "0"+seconds : String(seconds);
	}
	return time;
}



// E X P L O R A T I O N

function exploreM(button){

    button.setAttribute('disabled', true);
 	document.getElementById("mTime").innerHTML = "Time Left:"; // TODO: add countdown timer
	updateLog("Expedition started.");

    setTimeout(function() {
        button.removeAttribute('disabled');
        document.getElementById("mTime").innerHTML = "";  

        //stuff that happens when you return

        var randomCurrency = currencies[Math.floor(Math.random() * currencies.length)]; 
        var randomAmount = Math.floor(Math.random() * 100) + 1  
        randomCurrency.amount += randomAmount;

        updateLog("Expedition returned");  
        updateLog("Found " + String(randomAmount) + " " + randomCurrency.plural + "."); 

    }, 8000) //expedition length
}




