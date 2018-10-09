const TOP_USER_LIST_SIZE = 5;

/**
 * Class representing the frontend logic of the web application.
 */
class App {
  constructor() {
    this.readJSON();
  }

  /**
   * Asynchronous function that sends a GET request for the resource with the user data served
   * by the Node HTTP web server.
   * @param  {Function} callback Function to be run when a HTTP result has been
   * received by the client.
   */
  loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "http://localhost:8080/users-pasta.json", true);
    xobj.onreadystatechange = () => {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
    }
    xobj.send(null);
  }

  /**
   * Function that calls the loadJSON() function,  and then processes the data
   * received from the web server appropriately (parsing + crowding the tables
   * with the data).
   * @param {String} fullJSON The JSON resource represented as a String, which
   * we can in turn parse to process the data.
   */
  readJSON(fullJSON) {
    this.loadJSON((response) => {
      this.userData = JSON.parse(response);
      var top5Cavatappi = this.getTopUsersByPasta("cavatappi");
      var top5Fusilli = this.getTopUsersByPasta("fusilli");
      var top5Farfalle = this.getTopUsersByPasta("farfalle");
      var top5Orecchiette = this.getTopUsersByPasta("orecchiette");
      this.crowdTables("cavatappi", top5Cavatappi);
      this.crowdTables("fusilli", top5Fusilli);
      this.crowdTables("farfalle", top5Farfalle);
      this.crowdTables("orecchiette", top5Orecchiette);
    });
  }

  /**
   * Function that rounds a given number to n decimal places.
   * @param {Number} value Value to be rounded.
   * @param {Number} decimals Number of decimal places for the number to be
   * rounded to.
   * @return {Number} The rounded number.
   */
  round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

  /**
   * Function that sorts the object field userData which holds the data received
   * from the web server.
   * @param {String} pasta Text string representing the pasta sort that we're
   * interested in knowing the top users for.
   * @return {Object} Returns an array of size |TOP_USER_LIST_SIZE| with the users
   * that like the specified pasta the most in descending order.
   */
  getTopUsersByPasta(pasta) {
    /**
     * Sorts the data with a custom comparator that sorts the users depending
     * on the specified pasta sort. Sorts them in descending order.
     */
    this.userData.sort((a, b) => {
      if (a.favorites[pasta] == null) {
        return 1;
      } else if (b.favorites[pasta] == null) {
        return -1;
      }
      return b.favorites[pasta] - a.favorites[pasta];
    });
    var outputArr = this.userData.slice(0, TOP_USER_LIST_SIZE);
    return outputArr;
  }

  /**
   * Function that crowds a table with the specified pasta name from an array
   * consisting of the top |TOP_USER_LIST_SIZE| users. Creates appropriate HTML
   * elements (p, i) and puts them inside a <div> inside a <li> element.
   * @param {String} pastaName String represnting the pasta sort to be tabulated.
   * @param {Object} userArr Array holding the top users for that type of pasta.
   */
  crowdTables(pastaName, userArr) {
    var div = document.getElementById(pastaName);
    for (let i = 0; i < TOP_USER_LIST_SIZE; i++) {
      let listItem = document.createElement("li");
      let listDiv = document.createElement("div");
      let listIcon = document.createElement("i");
      let leftParagraph = document.createElement("p");
      let rightParagraph = document.createElement("p");
      listDiv.classList.add("listItem");
      listIcon.classList.add("far", "fa-circle", "listItem", "leftSideItem");
      leftParagraph.classList.add("listItem", "leftSideItem");
      leftParagraph.innerHTML = userArr[i].name;
      rightParagraph.innerHTML = this.round(userArr[i].favorites[pastaName], 2);
      rightParagraph.classList.add("listItem", "rightSideItem");
      this.setIconColor(listIcon, userArr[i]);
      listDiv.appendChild(listIcon);
      listDiv.appendChild(leftParagraph);
      listDiv.appendChild(rightParagraph);
      listItem.appendChild(listDiv);
      div.appendChild(listItem);
    }
  }

  createListDiv(pastaName) {
    var div = document.createElement("div");
    var h1 = document.createElement("h1");
    div.classList.add("title");
    h1.classList.add("title");
    h1.innerHTML = pastaName;
    div.appendChild(h1); // CONTINUE
  }

  /**
   * Function that colorizes an icon depending on the gender of the user that the
   * icon represents.
   * @param {Object} icon HTML <i> element to be colorized.
   * @param {Object} user Object representing the user that the icon corresponds to.
   */
  setIconColor(icon, user) {
    if (user.gender == "male") {
      icon.classList.add("iconMale");
    } else if (user.gender == "female") {
      icon.classList.add("iconFemale");
    } else { // Unspecified gender.
      icon.style.color = "white";
    }
  }
}

new App();
