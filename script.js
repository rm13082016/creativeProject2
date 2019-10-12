var page = 1;
const proxyurl = "https://cors-anywhere.herokuapp.com/";
function loadTopic(){
  document.body.style.cursor = "cursor/busy.gif";
  document.getElementById("results").innerHTML = "";
  if(document.getElementById("mainTopic").value == "select"){
    document.getElementById("sub").innerHTML = "";
  }
  else {
    var url = "https://swapi.co/api/";
    
    url += document.getElementById("mainTopic").value;
    console.log(url);
    /*global fetch*/
    fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      var inner = "<label for=\"subTopic\">Sub Topic</label><br><select id=\"subTopic\" onchange=\"loadSub()\">";
      inner += "<option value=\"select\">Select...</option>";
      for(let i = 0; i < json.results.length; i++){
        console.log(json.results[i].name);
        inner += "<option value=\"" + (i + 1) + "\">" + json.results[i].name + "</option>"; 
      }
      if (json.next == "null"){}
      else {
        inner += "<option value=\"more\">More...</option>";
      }
      inner += "</select>";
      document.getElementById("sub").innerHTML = inner;
      page = 1;
    });
  }
}

function loadSub(){
  var val = document.getElementById("subTopic").value
  if(val == "select"){document.getElementById("results").innerHTML = "";}
  else if(val == "more"){
    document.getElementById("results").innerHTML = "";
    var url = "https://swapi.co/api/";
    page++;
    url += document.getElementById("mainTopic").value;
    url += "/?page=" + page;
    console.log(url);
    /*global fetch*/
    fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      var inner = "<label for=\"subTopic\">Sub Topic</label><br><select id=\"subTopic\" onchange=\"loadSub()\">";
      inner += "<option value=\"select\">Select...</option>";
      inner += "<option value=\"previous\">Previous...</option>";
      for(let i = 0; i < json.results.length; i++){
        console.log(json.results[i].name);
        inner += "<option value=\"" + (((page - 1) * 10) + (i + 1)) + "\">" + json.results[i].name + "</option>"; 
      }
      if (json.next == null){}
      else {inner += "<option value=\"more\">More...</option>";}
      inner += "</select>";
      document.getElementById("sub").innerHTML = inner;
    });
  } 
  else if (val == "previous") {
    document.getElementById("results").innerHTML = "";
    var url = "https://swapi.co/api/";
    page--;
    url += document.getElementById("mainTopic").value;
    url += "/?page=" + page;
    console.log(url);
    /*global fetch*/
    fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      var inner = "<label for=\"subTopic\">Sub Topic</label><br><select id=\"subTopic\" onchange=\"loadSub()\">";
      inner += "<option value=\"select\">Select...</option>";
      if (json.previous == null){}
      else {inner += "<option value=\"previous\">Previous...</option>";}
      for(let i = 0; i < json.results.length; i++){
        console.log(json.results[i].name);
        inner += "<option value=\"" + (((page - 1) * 10) + (i + 1)) + "\">" + json.results[i].name + "</option>"; 
      }
      if (json.next == "null"){}
      else {
        inner += "<option value=\"more\">More...</option>";
      }
      inner += "</select>";
      document.getElementById("sub").innerHTML = inner;
    });
  }
  else {
    var url = "https://swapi.co/api/";
    url += document.getElementById("mainTopic").value;
    url += "/" + val;
    console.log(url);
    var request = new XMLHttpRequest()
    request.open('GET', proxyurl + url, true)
    request.onload = function() {
      var data = JSON.parse(this.response);
      console.log(data);
      var inner = "<table><thead><tr>";
      switch(document.getElementById("mainTopic").value){
        case "planets":
          inner = loadPlanet(data, inner);
          break;
        case "starships":
          inner = loadShips(data, inner);
          break;
        case "vehicles":
          inner = loadShips(data, inner);
          break;
        case "people":
          inner = loadPeople(data, inner);
          break;
        case "species":
          inner = loadSpecies(data, inner);
          break;
      }
      inner += "</tr></tbody></table>";
      document.getElementById("results").innerHTML = inner;
    }
    request.send()
  }
}

function loadPlanet(json, inner){
  console.log(json.name);
  inner += "<th>Name</th><th>Climate</th><th>Terrain</th><th>Population</th></tr></thead><tbody><tr>";
  inner += "<td>" + json.name + "</td>";
  inner += "<td>" + json.climate.capitalize() + "</td>";
  inner += "<td>" + json.terrain.capitalize() + "</td>";
  inner += "<td>" + json.population + "</td>";
  return inner;
}

function loadShips(json, inner){
  inner += "<th>Name</th><th>Model</th><th>Manufacturer</th><th>Passengers</th></tr></thead><tbody><tr>";
  inner += "<td>" + json.name + "</td>";
  inner += "<td>" + json.model + "</td>";
  inner += "<td>" + json.manufacturer + "</td>";
  inner += "<td>" + json.passengers + "</td>";
  return inner;
}

function loadPeople(json, inner){
  inner += "<th>Name</th><th>Gender</th><th>Eye Color</th><th>Hair Color</th><th>Height (cm)</th><th>Mass (kg)</th></tr></thead><tbody><tr>";
  inner += "<td>" + json.name + "</td>";
  inner += "<td>" + json.gender.capitalize() + "</td>";
  inner += "<td>" + json.eye_color.capitalize() + "</td>";
  inner += "<td>" + json.hair_color.capitalize() + "</td>";
  inner += "<td>" + json.height + "</td>";
  inner += "<td>" + json.mass + "</td>";
  return inner;
}

function loadSpecies(json, inner){
  inner += "<th>Name</th><th>Language</th><th>Classification</th><th>Designation</th><th>Average Height (M)</th><th>Average Lifespan</th></tr></thead><tbody><tr>";
  inner += "<td>" + json.name + "</td>";
  inner += "<td>" + json.language + "</td>";
  inner += "<td>" + json.classification + "</td>";
  inner += "<td>" + json.designation + "</td>";
  inner += "<td>" + json.average_height + "</td>";
  inner += "<td>" + json.average_lifespan + "</td>";
  return inner;
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};