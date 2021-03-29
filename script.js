function onload() {
  ProjectData.initialize();
  Search.initialize();
  Projects.initializeWebpage();
}
class ProjectData {
  static initialize() {
    this.tags = this.getUniques("tags");
    this.creators = this.getUniques("creators");
    this.featurables = this.getProjectsWithPropertyValue("image",["!none"]);
  }
  //getUniques() is a generalized version of a very specific problem that i had to do twice
  static getUniques(property) {
    var uniques = [], i, j, k, progress, potentials;

    for (i = 0; i < ProjectData.rawProjectData.length; i++) {
      potentials = ProjectData.rawProjectData[i][property].split(",");
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
  static getProjectsWithPropertyValue(property,values) {
    var i,
    progress,
    projectValues,
    bannedValues = [],
    projectsWithValue = [];

    for (i = 0; i < values.length; i++) {
      if (values[i][0] == "!") {
        bannedValues.push(values[i].slice(1));
        values.splice(i,1);
      }
    }

    for (i = 0; i < ProjectData.rawProjectData.length; i++) {
      //console.log(ProjectData.rawProjectData[i].name + " " + property);
      projectValues = ProjectData.rawProjectData[i][property].split(",");
      if (isSuperset(projectValues,values) && !containsAny(projectValues,bannedValues)) {
        projectsWithValue.push(ProjectData.rawProjectData[i]);
      }
    }
    return projectsWithValue;
  }
  static openLink(linkString) {
    console.log(linkString);
    if (linkString.slice(0,5) == "https") {
      window.open(linkString);
    }
  }
}
class Projects {
  static initializeWebpage() {
    this.displayFeaturedProject(ProjectData.featurables[randNum(ProjectData.featurables.length - 1)]);
    this.createOngoingProjects();
    this.createInitialProjects();
  }
  static createOngoingProjects() {
    var i,
    ongoingProjects = ProjectData.getProjectsWithPropertyValue("endDate",["ongoing"]);

    var amountToDisplay = ongoingProjects.length;

    shuffleArray(ongoingProjects);
    for (i = 0; i < amountToDisplay; i++) {
      let projectElement = this.createProjectElement(ongoingProjects[i]);
      document.getElementById("ongoingProjects").appendChild(projectElement);
    }
  }
  static createInitialProjects() {
    var projectsToDisplay = ProjectData.getProjectsWithPropertyValue("endDate",["!ongoing"]);
    shuffleArray(ongoingProjects);
    for (var i = 0; i < projectsToDisplay.length; i++) {
      let projectElement = this.createProjectElement(projectsToDisplay[i]);
      document.getElementById("genericProjects").appendChild(projectElement);
    }
  }
  static displayFeaturedProject(projectObject) {
    var featuredProject = document.getElementById("featuredProject");
    featuredProject.setAttribute("data-link",projectObject.link);
    featuredProject.onclick = function() {
      ProjectData.openLink(this.getAttribute("data-link"));
    };
    featuredProject.children[0].src = "images/projects/" + projectObject.image + ".png";
    featuredProject.children[1].children[0].innerHTML = projectObject.name;
    featuredProject.children[1].children[1].innerHTML = projectObject.description;
    let tags = featuredProject.children[1].children[2];

    var tagHeader = document.createElement("p");
    tagHeader.className = "greyText tagHeader";
    tagHeader.innerHTML = "tags: ";
    tags.appendChild(tagHeader);
    var objectTags = projectObject.tags.split(",");
    for (var i = 0; i < objectTags.length; i++) {
      tags.appendChild(Search.createTagElement(objectTags[i]));
    }

    var creatorHeader = document.createElement("p");
    creatorHeader.className = "greyText tagHeader";
    creatorHeader.innerHTML = "creators: ";
    tags.appendChild(creatorHeader);
    var objectCreators = projectObject.creators.split(",");
    for (var i = 0; i < objectCreators.length; i++) {
      tags.appendChild(Search.createCreatorElement(objectCreators[i]));
    }
  }
  static createProjectElement(projectObject) {
    var projectElement = document.createElement("div");
    projectElement.className = "project";
    projectElement.setAttribute("data-link",projectObject.link);
    projectElement.onclick = function() {
      ProjectData.openLink(this.getAttribute("data-link"));
    };
    var title = document.createElement("h2");
    title.innerHTML = projectObject.name;
    var description = document.createElement("p");
    description.className = "projectDesc";
    description.innerHTML = projectObject.description;

    var tags = document.createElement("div");
    tags.className = "projectTags smallText";

    var tagHeader = document.createElement("p");
    tagHeader.className = "greyText tagHeader";
    tagHeader.innerHTML = "tags: ";
    tags.appendChild(tagHeader);
    var objectTags = projectObject.tags.split(",");
    for (var i = 0; i < objectTags.length; i++) {
      tags.appendChild(Search.createTagElement(objectTags[i]));
    }

    var creatorHeader = document.createElement("p");
    creatorHeader.className = "greyText tagHeader";
    creatorHeader.innerHTML = "creators: ";
    tags.appendChild(creatorHeader);
    var objectCreators = projectObject.creators.split(",");
    for (var i = 0; i < objectCreators.length; i++) {
      tags.appendChild(Search.createCreatorElement(objectCreators[i]));
    }

    projectElement.appendChild(title);
    projectElement.appendChild(description);
    projectElement.appendChild(tags);
    return projectElement;
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
    var i, element,
    searchTags = document.getElementById("searchTags"),
    searchCreators = document.getElementById("searchCreators");

    for (i = 0; i < ProjectData.tags.length; i++) {
      searchTags.appendChild(this.createTagElement(ProjectData.tags[i]));
    }
    for (i = 0; i < ProjectData.creators.length; i++) {
      searchCreators.appendChild(this.createCreatorElement(ProjectData.creators[i]));
    }
  }
  static createCreatorElement(creator) {
    var randFactor = creator.charCodeAt(0) + creator.charCodeAt(creator.length - 1);
    var element = document.createElement("p");
    element.className = "tag creator";
    element.style.backgroundColor = "rgb(110,230,95)";
    element.innerHTML = creator;
    element.onclick = function() {
      Search.addCreator(this.innerHTML);
    };
    return element;
  }
  static createTagElement(tag) {
    var randFactor = tag.charCodeAt(0);
    var element = document.createElement("p");
    element.className = "tag";
    element.style.backgroundColor = "hsl(" + (randFactor * 30 + randFactor*randFactor*10) + ",100%,75%)";
    element.innerHTML = tag;
    element.onclick = function() {
      Search.addTag(this.innerHTML);
    };
    return element;
  }
  static addCreator(creator) {

  }
  static addTag(creator) {

  }
  static createSpecialTag(tag) {
    //special tag colors

    //
    var element = createTagElement(tag);
  }
}
function randNum(max) {
  return Math.round(Math.random() * max);
}
//isSuperset(x,y) returns true if y is a subset of x, otherwise it returns false
function isSuperset(mainArray,subset) {
  var progress;
  for (var i = 0; i < subset.length; i++) {
    progress = false;
    for (var j = 0; j < mainArray.length; j++) {
      if (mainArray[j] == subset[i]) {
        progress = true;
        break;
      }
    }
    if (progress == false) {
      return false;
    }
  }
  return true;
}
function containsAny(mainArray,bannedElements) {
  for (var i = 0; i < bannedElements.length; i++) {
    for (var j = 0; j < mainArray.length; j++) {
      if (mainArray[j] == bannedElements[i]) {
        return true;
      }
    }
  }
  return false;
}
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
/*

deprecated functions

//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function seededRand(seed,max) {
    var x = Math.sin(seed++) * 10000;
    return Math.round((x - Math.floor(x)) * max);
}
*/
