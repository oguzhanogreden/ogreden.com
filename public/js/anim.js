var catTiles = document.getElementsByClassName("cat");

let tileBoundRectCli = catTiles[0].getBoundingClientRect();
// for (let tile of catTiles) {
//   tile.addEventListener("click", growAnimated);
// }

function growAnimated(event) {
  // let hiding = selectClassButThis("cat", this);
  // toggleClassInArray(hiding, "hidden");

  // replace grid with placeholder,
  // append the div to placeholder,
  let grid = document.getElementsByClassName("categories")[0];
  let placeholder = document.createElement("div");
  placeholder.setAttribute("style", "grid-area: main;")
  placeholder.classList.add("placeholder");
  let stretchedCopy = this.cloneNode(true);

  // TODO: figure this out! What's going on with positioning?
  // console.log(+this.getBoundingClientRect().left,
  //             +this.getBoundingClientRect().top,
  //             +(this.getBoundingClientRect().right - this.getBoundingClientRect().left) );

  // write position so that tranisition work:
  console.log($(this).height());
  stretchedCopy.setAttribute("style", "position: absolute;" +
  "left: " + $(this).position().left + "px;" +
  "width:" + $(this).outerWidth() + "px;" +
  "height:" + $(this).outerHeight() + "px;");

  stretchedCopy.setAttribute("data-shrunk-left", $(this).position().left);
  stretchedCopy.setAttribute("data-shrunk-width", $(this).outerWidth());
  stretchedCopy.setAttribute("data-height", $(this).outerHeight());

  // hide grid, add a placeholder div:
  grid.parentNode.insertBefore(placeholder, grid);
  grid.setAttribute("style", "display:none; opacity: 0;");
  placeholder.appendChild(stretchedCopy);

  // grow the tile to whole screen:
  stretchedCopy.setAttribute("style", "position: absolute;" +
  "left: " + $(placeholder).position().left + "px;" +
  // "top: " + $(placeholder).position().top + "px;" +
  "width:" + $(placeholder).outerWidth() + "px;" +
  "height:" + $(placeholder).outerHeight() + "px;");

  // add return button:
  let returnButtonCont = document.createElement("div");
  returnButtonCont.setAttribute("height", "50");
  returnButtonCont.setAttribute("width", "50");
  returnButtonCont.classList.add("returnButton", "hidden");
  returnButtonCont.setAttribute("style", "left:" +
  ($(this).position().left + $(placeholder).width() - 10) + "px;" );

  let returnButton = document.createElement("i");
  returnButton.className = "fas fa-times fa-lg";
  returnButton.addEventListener("click", shrinkAnimated);
  returnButtonCont.appendChild(returnButton);

  // add returnButton in sync with grow animation:
  placeholder.appendChild(returnButtonCont);
  window.setTimeout(function (x) {
    returnButtonCont.classList.toggle("hidden");
  }, 300);

}

function shrinkAnimated(event) {
  let grid = document.getElementsByClassName("categories")[0];
  let placeholder = document.getElementsByClassName("placeholder")[0];
  let strechtedDiv = placeholder.children[0];


  strechtedDiv.setAttribute("style", "position: absolute;" +
    "left: " + strechtedDiv.dataset.shrunkLeft + "px;" +
    "width:" + strechtedDiv.dataset.shrunkWidth + "px;" +
    "height:" + strechtedDiv.dataset.height + "px;");

    // placeholder.classList.toggle("hidden");
  grid.setAttribute("style", "opacity: 0;");
  window.setTimeout(function () {
    placeholder.remove();
    grid.setAttribute("style", "opacity: 1;");
  }, 100);



}

function selectClassButThis(className, thisElem) {
  let selection = document.getElementsByClassName(className);
  let ret = [];

  for (let elem of selection) {
    if (!(elem == thisElem)) {
      ret.push(elem);
    }
  }

  return(ret);
}

function toggleClassInArray(array, _class) {
  for (let elem of array) {
    elem.classList.toggle(_class);
  }
}

function getElementOffset(element)
{
  var de = document.documentElement;
  var box = element.getBoundingClientRect();
  var top = box.top + window.pageYOffset - de.clientTop;
  var left = box.left + window.pageXOffset - de.clientLeft;
  return { top: top, left: left };
}
