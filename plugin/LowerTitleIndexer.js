/*\
title: $:/plugins/bluegreen/case-insensitive/LowerTitleIndexer.js
type: application/javascript
module-type: indexer

Add LowerTitleIndexer
It creates a hashmap of {title.toLowerCase(): title}.

To get the proper-case title from non-proper-case titles, call
 $tw.wiki.getIndexer("LowerTitleIndexer").lookup(title)
 And it will return this.index[title.toLowerCase()]
\*/

(function() {
  "use strict";

  const DuplicateError = require("./DuplicateLowerTitleError.js");
  function LowerTitleIndexer(wiki) {
    this.wiki = wiki;
    this.index = Object.create(null);
    this.hasDuplicates = false;
  }

  LowerTitleIndexer.prototype.init = function() {
    this.build();

    const errTitle = "$:/plugins/bluegreen/case-insensitive/SameNameWarning";
    const onLaunch = function(storyList) {
      if (self.hasDuplicates === true) {
        storyList.unshift(errTitle);

        // Don't show the warning next time user clicks home.
        self.hasDuplicates = false;
      }
      return storyList;
    };
    $tw.hooks.addHook("th-opening-default-tiddlers-list", onLaunch);
  };

  LowerTitleIndexer.prototype.rebuild = function() {
    this.index = Object.create(null);
    this.build();
  };

  LowerTitleIndexer.prototype.build = function() {
    const self = this;
    self.hasDuplicates = false;
    DuplicateError.clearDuplicates();

    this.wiki.each(function(tiddler, title) {
      const loweredTitle = title.toLowerCase();
      if (self.index[loweredTitle]) {
        self.hasDuplicates = true;
        DuplicateError.addDuplicate(loweredTitle, self.index[loweredTitle]);
        DuplicateError.addDuplicate(loweredTitle, title);
        return;
      }
      self.index[loweredTitle] = title;
    });
  };

  LowerTitleIndexer.prototype.update = function(updateDescriptor) {
    const oldT = updateDescriptor.old.tiddler;
    const newT = updateDescriptor.new.tiddler;
    if (oldT) {
      const oldTitle = oldT.fields["title"];
      const oldLowerTitle = oldTitle.toLowerCase();
      const idxTitle = this.index[oldLowerTitle];
      if (!idxTitle) {
        // for debugging purposes
        const errMsg = (
          "WARNING!LowerTitleIndexer: " +
          "Title that wasn't indexed got modified: " +
          oldTitle
        );
        console.log(errMsg);
      }
      delete this.index[oldLowerTitle];
    }
    if (newT) {
      const newTitle = newT.fields["title"];
      const newLowerTitle = newTitle.toLowerCase();
      this.index[newLowerTitle] = newTitle;
    }
  };

  LowerTitleIndexer.prototype.lookup = function(title) {
    return this.index[title.toLowerCase()];
  };

  exports.LowerTitleIndexer = LowerTitleIndexer;
})();
