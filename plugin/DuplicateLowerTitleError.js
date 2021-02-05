/*\
title: $:/plugins/bluegreen/case-insensitive/DuplicateLowerTitleError.js
type: application/javascript
module-type: macro

\*/

(function() {
  "use strict";

  let duplicates = Object.create(null);

  exports.clearDuplicates = function() {
    duplicates = Object.create(null);
  };

  exports.addDuplicate = function(lower, title) {
    // lower: title.toLowerCase()
    // title: title of duplicate tiddler
    if (!(lower in duplicates)) {
      duplicates[lower] = [];
    }
    if (duplicates[lower].indexOf(title) === -1) {
      // there may be more than 2 tiddlers with same lower-case titles
      duplicates[lower].push(title);
    }
  };

  exports.name = "DuplicateLowerTitleError";
  exports.params = [];
  exports.run = function() {
    if (Object.keys(duplicates).length === 0) {
      return "!!There are no duplicate case-insensitive tiddlers";
    }
    const titleStr = "!!Duplicate case-insensitive tiddlers were detected.";
    let outputStr = "";
    for (const key of Object.keys(duplicates)) {
      const duplicate = duplicates[key];
      for (let y = 0; y < duplicate.length; y++) {
        // Avoid having to escape special characters.
        // Using wikilinks do not work because lowerLinkWidget has overloaded it
        //  and these links all have the same lower-case titles.
        const duplicateTitle = duplicate[y];
        const outerEl = document.createElement("span");
        const linkEl = document.createElement("a");
        linkEl.setAttribute("href", "#" + duplicateTitle);
        linkEl.innerHTML = duplicateTitle;
        linkEl.className = "tc-tiddlylink tc-tiddlylink-resolves";
        outerEl.appendChild(linkEl);

        outputStr += outerEl.innerHTML + "<br>";
        console.log(outerEl.innerHTML);
      }
      outputStr += "<hr>" + "<br>";
    }
    return titleStr + "<br><br>" + outputStr;
  };
})();
