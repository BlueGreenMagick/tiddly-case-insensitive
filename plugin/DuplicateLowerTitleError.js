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

  function generateWarningBody() {
    const title = "<h2><span class='tc-alert-highlight'>Warning: </span>" +
                  "Duplicate case-insensitive tiddler titles were found!</h2>";
    const subTitle = "Please rename the tiddlers by clicking the below links.";
    let outputStr = title + subTitle;
    for (const key of Object.keys(duplicates)) {
      outputStr += "<hr>";
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
    }
    return outputStr;
  }

  exports.run = function() {
    let bodyStr;

    if (Object.keys(duplicates).length === 0) {
      bodyStr = "!!Found no tiddlers with duplicate case-insensitive titles";
    } else {
      bodyStr = generateWarningBody();
    }


    return "<div class='tc-alert'>" + bodyStr + "</div>";
  };
})();
