function onload() {
  ProjectData.initialize();
  Search.initialize();
}
class ProjectData {
  static initialize() {
    this.tags = this.getUniques("tags");
    this.creators = this.getUniques("creators");
  }
  //getUniques() is a generalized version of a very specific problem that i had to do twice
  static getUniques(property) {
    let uniques = [], i, j, k, progress, potentials;

    for (i = 0; i < projects.length; i++) {
      potentials = projects[i][property].split(",");
      for (j = 0; j < potentials.length; j++) {
        progress = true;
        for (k = 0; k < uniques.length; k++) {
          if (uniques[k] == potentials[j]) {
            progress = false;
            break;
          }
        }
        if (progress) {
          uniques.push(potentials[j]);
        }
      }
    }
    return uniques;
  }
}
class Search {
  static initialize() {
    this.createTagElements();
  }
  static toggle(state) {
    var searchBar = document.getElementById("searchBar");
    var suggestions = document.getElementById("searchBarSuggestions");
    if (state == true) {
      suggestions.style.display = "block";
      searchBar.style.borderRadius = "20px 20px 0 0";
      searchBar.style.border = "1px solid rgb(110,240,255)";
      searchBar.style.borderWidth = "1px 1px 0 1px";
      searchBar.style.padding = "9px 20px 10px 48px";
      document.getElementById("searchBarText").innerHTML = "";
      document.getElementById("darkBackground").style.opacity = 0.4;
      document.getElementById("darkBackground").style.pointerEvents = "all";
    } else {
      suggestions.style.display = "none";
      searchBar.style.borderRadius = "20px";
      searchBar.style.border = "0";
      searchBar.style.borderWidth = "0";
      searchBar.style.padding = "10px 20px 10px 49px";
      document.getElementById("darkBackground").style.opacity = 0;
      document.getElementById("darkBackground").style.pointerEvents = "none";
    }
  }
  static createTagElements() {
    let i, element;

    for (i = 0; i < ProjectData.tags.length; i++) {
      this.createTagElement(ProjectData.tags[i]);
    }
    for (i = 0; i < ProjectData.creators.length; i++) {
      this.createCreatorElement(ProjectData.creators[i]);
      console.log(this.createCreatorElement);
    }
  }
  static createCreatorElement(creator) {
    let randFactor = creator.charCodeAt(0);
    let element = document.createElement("p");
    element.className = "tag creator";
    element.style.backgroundColor = "hsl(" + (randFactor * 20 + randFactor*randFactor*15 + 100) + ",100%,72%)";
    element.innerHTML = creator;
    element.onclick = function() {
      Search.addCreator(this.innerHTML);
    };
    document.getElementById("searchCreators").appendChild(element);
  }
  static createTagElement(tag) {
    let randFactor = tag.charCodeAt(0);
    let element = document.createElement("p");
    element.className = "tag";
    element.style.backgroundColor = "hsl(" + (randFactor * 30 + randFactor*randFactor*10) + ",100%,72%)";
    element.innerHTML = tag;
    element.onclick = function() {
      Search.addTag(this.innerHTML);
    };
    document.getElementById("searchTags").appendChild(element);
  }
  static addCreator(creator) {

  }
}
function randNum(max) {
  return Math.round(Math.random() * max);
}
/*

deprecated functions

//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function seededRand(seed,max) {
    var x = Math.sin(seed++) * 10000;
    return Math.round((x - Math.floor(x)) * max);
}
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
*/
