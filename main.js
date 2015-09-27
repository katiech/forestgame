var currency = 0;
var cost = 5;
var thing= 0;
var rate= 1;

var Auto = setInterval(autoAdd, 1000);
function autoAdd() {
   
   currency = currency + rate;
   updateAll();

}


function updateAll(){

document.getElementById("cost").innerHTML = cost;
document.getElementById("currency").innerHTML = currency;
document.getElementById("things").innerHTML = thing;

}

function Add(){
	
currency = currency + 1;
updateAll();

}

function Buy(){

if (currency >= cost){
currency = currency - cost;
thing = thing + 1;
cost = cost + 1;
updateAll();
updateLog(">>Bought a Thing");

}

else

updateLog(">>Not enough Currency");




}

function updateLog(string){


var oldlog = document.getElementById("log").innerHTML;
document.getElementById("log").innerHTML = string + "<br>" + oldlog;



}



function clearLog(){

document.getElementById("log").innerHTML = ">>";




}
