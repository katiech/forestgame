


// To do on page load.
window.onload = function() {
	// Generates garden plots. Check if garden unlocked???
	gardenTable();
	initalizeGarden();
	// Auto loads if save file present.
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (typeof savegame !== "undefined") {
		GameLoad();
	}
	if (stats.startDate == null) {
		stats.startDate = new Date().toString();
		console.log("new date");
	}
};




// S A V E

var stats = {
	startDate: null
}

function getElapsedTime() {
	var timeNow = new Date();
	var timeThen = new Date(stats.startDate);
	var elapsed = timeNow.getTime() - timeThen.getTime();
	console.log(elapsed);
	return secondsToTime(Math.floor(elapsed / 1000));
}

function composeSave() {
	var statsSave = [stats.startDate];
	// Makes currency amounts into array.
	var currenciesSave = [];
	for (c = 0; c < currencies.length; c++) {
		currenciesSave.push(currencies[c].amount);
	}
	// Makes animal amounts into array.
	var animalsSave = [];
	for (a = 0; a < animals.length; a++) {
		animalsSave.push(animals[a].amount);
	}
	// Makes garden plot info into array.			DOES NOT TAKE INTO ACCOUNT GROWING TIMES FOR PLANTS YET
	var gardenSave = [];
	for (p = 0; p < numPlots; p++) {
		gardenSave.push([garden[p].state, garden[p].crop, garden[p].timeLeft]);
	}
	// Makes exploration into into array.
	var exploreSave = [team.state, team.timeLeft];
	return [statsSave, currenciesSave, animalsSave, gardenSave, exploreSave];
}

function parseSave(save) {
	stats.startDate = new Date(save[0][0]).toString();

	var currenciesSave = save[1];
	for (c = 0; c < currencies.length; c++) {
		currencies[c].amount = currenciesSave[c];
	}
	var animalsSave = save[2];
	for (a = 0; a < animals.length; a++) {
		animals[a].amount = animalsSave[a];
	}
	var gardenSave = save[3];
	for (p = 0; p < numPlots; p++) {
		garden[p].state = gardenSave[p][0];
		garden[p].crop = gardenSave[p][1];
		garden[p].timeLeft = gardenSave[p][2];
		// Gets the plot timers running again.
		if (garden[p].timeLeft != null) {
			cropTimer(garden[p].timeLeft, p);
		}
		reimagePlot(p);
	}
	var exploreSave = save[4];
	team.state = exploreSave[0];
	team.timeLeft = exploreSave[1];
	if (team.timeLeft != null) {
		exploreTimer(team.timeLeft, team.state);
	}
}

function GameSave() {
	var save = composeSave();
	localStorage.setItem("save", JSON.stringify(save));
	updateLog("Game Saved!");
};

function GameLoad() {
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (savegame !== null) {
		parseSave(savegame);
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


// Auto save
var saveFrequency = 30;
var autoSave = autoSaveTimer(saveFrequency);
function autoSaveTimer(freq) {
	autoSave = setInterval(function() {
		GameSave();
	}, freq * 1000);
	return autoSave;
}
function setSaveFreq(freq) {
	clearInterval(autoSave);
	if (freq != 0) {
		autoSave = autoSaveTimer(freq);
	}
	saveFrequency = freq;
}






// C E N T E R  N A V

var centerId = 1;
function show(id) {
	for (i = 1; i <= 4; i++){
  	  	document.getElementById("center" + i).style.display = "none";
	}   
	 document.getElementById("center" + id).style.display = "block";
	 centerId = id;
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
	growthTime: 10, 		// takes 10 seconds to finish growing
	plantCost: [0, 10],		// currencyind, amount
	harvest: [3, 2, 5] 		// currencyind, min, max
};
var carrot = {
	name: 'carrot',
	plural: 'carrots',
	amount: 0,
	rate: 0,
	growthTime: 20,
	plantCost: [0, 200],
	harvest: [4, 2, 5]
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
	baseCost: 5,
	rate: 0, 		// Rate sparrows are being increased.
	earnRate: [1, 0, 0, 0, 0]		// list of rates for currencies: seed, gold, acorn, grass, carrot, etc.
};
var magpie = {
	name: 'magpie',
	plural: 'magpies',
	amount: 0,
	cost: [0, 100], 		// seeds 0
	baseCost: 100,
	rate: 0,
	earnRate: [10, 0.1, 0, 0, 0]
};
var squirrel = {
	name: 'squirrel',
	plural: 'squirrels',
	amount: 0,
	cost: [0, 10000], 		// seeds 0
	baseCost: 10000,
	rate: 0,
	earnRate: [1000, 0, 0.1, 0, 0]
};
var rabbit = {
	name: 'rabbit',
	plural: 'rabbits',
	amount: 0,
	cost: [3, 10], 			// grass 3
	baseCost: 10,
	rate: 0,
	earnRate: [100, 0, 0, 1, 0.1]
};
var otter = {
	name: 'otter',
	plural: 'otters',
	amount: 0,
	cost: [3, 100], 		// grass 3
	baseCost: 100,
	rate: 0,
	earnRate: [1000, 0, 1, 0, 0]
};
var animals = [sparrow, magpie, squirrel, rabbit, otter];

function buyAnimal(animal, num) {
	var res = currencies[animal.cost[0]]
	var val = animal.cost[1]
	if (res.amount >= val * num) {
		animal.amount += num;
		res.amount -= val * num;
		updateAll();
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





// U P D A T I N G  R E S O U R C E S

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
	for (c = 0; c < currencies.length; c++) {
		var newRate = 0;
		if (c == 0) {		// Extra 1 seeds/s
			newRate++;
		}
		for (a = 0; a < animals.length; a++) {
			newRate += animals[a].amount * animals[a].earnRate[c];
		}
		currencies[c].rate = newRate;
	}
	for (r = 0; r < currencies.length; r++) {
		document.getElementById(currencies[r].name + "Rate").innerHTML = fixValue(currencies[r].rate);
	}
};

function updateCosts() {
	for (a = 0; a < animals.length; a++) {
		animals[a].cost[1] = Math.floor(animals[a].baseCost * Math.pow(1.15, animals[a].amount));
		document.getElementById(animals[a].name + "Cost").innerHTML = fixValue(animals[a].cost[1] * buyAmount);
	}
};

function updateAll() {
	updateResources();
	updateRates();
	updateCosts();
};





window.setInterval(function() {
	collectCurrencies();
	updateResources();
	checkUnlock();
	if (centerId == 4) {
		document.getElementById("timeSince").innerHTML = getElapsedTime();
	}
}, 1000);		// fires every 1000ms






// L O G

function updateLog(string){
	var oldlog = document.getElementById("log").innerHTML;
	document.getElementById("log").innerHTML = string + "<br>" + oldlog;
}

function clearLog() {
	document.getElementById("log").innerHTML = "Log is cleared.";
}






// T H E  G A R D E N

function plot(state, id) {
	this.id = id;
	this.name = "plot" + id;
	this.state = state;			// locked, empty, growing, ready
	this.crop = null; 			// holds index of type of plant; 0 if grass, 1 if carrot
	this.timeLeft = null;
}

var garden = [];
var numPlots = 16, colPlots = 4;
var tableCreated = false;

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
	if (garden[plot].state == 0) {
		garden[plot].state = 1;
		updateLog("Unlocked a plot.");
	}
}

var planting = 0;
function selectCrop(crop) {
	planting = crop;
	for (b = 0; b < plants.length; b++) { 
		// document.getElementById("plant" + b).setAttribute("class", "unbold");
		document.getElementById("plant" + b).setAttribute("src", "img/" + plants[b].name + "-seeds2" + ".png");
	}
	// document.getElementById("plant" + crop).setAttribute("class", "bold");
	document.getElementById("plant" + crop).setAttribute("src", "img/" + plants[crop].name + "-seeds" + ".png");
}

// Plants cropId at plotId.
function plantPlot(plotId, cropId) {
	if (garden[plotId].state == 1) {
		garden[plotId].crop = cropId;
		garden[plotId].state = 2;
		cropTimer(plants[cropId].growthTime, plotId);
		updateLog("Planted a " + plants[cropId].name + ".");
	}
}

function harvestPlot(plot) {
	if (garden[plot].state == 3) {
		var crop = plants[garden[plot].crop];
		var num = getRandomInt(crop.harvest[1], crop.harvest[2]);
		currencies[crop.harvest[0]].amount += num;
		garden[plot].crop = null;
		garden[plot].state = 1;
		document.getElementById("plotTimer" + plot).innerHTML = "";
		return num;
	}
}

function harvestAll() {
	var harvested = zeroArray(plants.length);
	for (var p = 0; p < numPlots; p++) {
		if (garden[p].state == 3) {
			var cropId = garden[p].crop;
			harvested[cropId] += harvestPlot(p);
			reimagePlot(p);
		}
	}
	var harvestArray = [];
	for (var c = 0; c < harvested.length; c++) {
		if (harvested[c] != 0) {
			harvestArray.push(harvested[c] + " " + plants[c].plural);
		}
	}
	if (harvestArray.length == 0) {
		updateLog("There are no crops ready for harvest.");
	} else {
		var harvestString = "";
		if (harvestArray.length == 1) {
			harvestString = harvestArray[0];
		} else if (harvestArray.length == 2) {
			harvestString = harvestArray[0] + " and " + harvestArray[1];
		} else {
			for (var a = 0; a < harvestArray.length; a++) {
				if (a == harvestArray.length - 1) {
					harvestString += "and " + harvestArray[a];
				} else {
					harvestString += harvestArray[a] + ", ";
				}
			}
		}
		updateLog("You harvest a total of " + harvestString + ".");
	}
}

function plotAction(plot) {
	if (garden[plot].state == 0) {
		unlockPlot(plot);
	} else if (garden[plot].state == 1) {
		plantPlot(plot, planting);
	} else if (garden[plot].state == 3) {
		var crop = plants[garden[plot].crop];
		var num = harvestPlot(plot);
		updateLog("You harvested " + num + " " + crop.plural + ".");
	}
	reimagePlot(plot);
}

function cropTimer(seconds, plot) {
	timer(seconds, garden[plot], "plotTimer" + plot, "READY");
	setTimeout(function () {
		garden[plot].state = 3;
		reimagePlot(plot);
		updateLog("A " + plants[garden[plot].crop].name + " has finished growing!");
	}, seconds * 1000);
}	






// E X P L O R A T I O N

var team = {
	state: 0,				// not exploring, mountains, river
	timeLeft: null
};

function exploreM(button) {
    button.setAttribute('disabled', true);
	updateLog("Expedition started.");
	exploreTimer(60, 1);
};

function exploreTimer(seconds, area) {
	timer(seconds, team, "mTime", "");
	team.state = area;
	setTimeout(function () {
        document.getElementById("exploreM").removeAttribute('disabled');
		var randomCurrency = currencies[Math.floor(Math.random() * currencies.length)]; 
		var randomAmount = getRandomInt(1, 50);
		updateLog("Expedition returned.");
        updateLog("Found " + randomAmount + " " + randomCurrency.plural + "."); 
        randomCurrency.amount += randomAmount;
		team.state = 0;
	}, seconds * 1000);
}	






// U N L O C K I N G

var unlockedAnimals = [true, false, false, false, false];

function checkUnlock() {
	for (i = 0; i <animals.length; i++) {
		if (currencies[animals[i].cost[0]].amount  >= animals[i].cost[1]){
			if (unlockedAnimals[i] == false) {
				unlock(i);
				unlockedAnimals[i] = true;
			}
		}
	}			
};

function unlock(i){
	updateLog("Unlocked " + animals[i].plural + "!");
	document.getElementById("buy" + capitalize(animals[i].name)).removeAttribute('disabled');
	// document.getElementById("buy" + capitalize(animals[i].name)).innerHTML="unlockedimage";
}





// H E L P E R  F U N C T I O N S

function article(animal){
	if ("aeiou".indexOf(animal.name[0]) >= 0){
		return "an " + animal.name;
	} else {
		return "a " + animal.name;
    }
}

function fixValue(resource) {
	// Forces floats to always display to 2 decimal places if < 1. Makes sure zero says 0 and not 0.00.
	if (resource != 0) {
		if (resource >= 1) {
			resource = resource.toFixed(0);
		} else {
			resource = resource.toFixed(2);
		}
	}
	// Truncates large values and tacks on a suffix.
	var suffixes = ["K","M","B","T","Qa","Qt","Sx","Sp","Oc","Dc"];
	for (var i = suffixes.length - 1; i >= 0; i--) {
		if (resource >= Math.pow(1000, i + 1)) {
			return (resource / Math.pow(1000, i + 1)).toFixed(2) + suffixes[i];
		}
	}
	return resource;
}

function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min +1)) + min;
}

function zeroArray(len) {
	return Array(len+1).join('0').split('').map(parseFloat);
}

function secondsToTime(seconds) {
	var days 	= Math.floor(seconds / 86400);
	var hours	= Math.floor((seconds - (days * 86400)) / 3600);
	var minutes = Math.floor((seconds - (days * 86400) - (hours * 3600)) / 60);
	var seconds = seconds - (days * 86400) - (hours * 3600) - (minutes * 60);
	var time = "";
	if (days != 0) {
		time = days + ":";
	} if (hours != 0) {
		time += hours + ":";
	} if (minutes != 0 || time !== "") {
		minutes = (minutes < 10 && time !== "") ? "0" + minutes : String(minutes);
		time += minutes + ":";
	} if (time === "") {
		time = seconds + "s";
    } else {
		time += (seconds < 10) ? "0" + seconds : String(seconds);
	}
	return time;
}

function timer(seconds, counter, elemId, completedString) {
    document.getElementById(elemId).innerHTML = secondsToTime(seconds);
    var countdownTimer = setTimeout(decrease, 1000);
    function decrease() {
    	seconds--;
    	document.getElementById(elemId).innerHTML = secondsToTime(seconds);
    	counter.timeLeft = seconds;
        if (seconds !== 0) {
        	setTimeout(decrease, 1000);
    	} else {
    		clearTimeout(countdownTimer);
    		document.getElementById(elemId).innerHTML = completedString;
    		counter.timeLeft = null;
    	}
    }
}




