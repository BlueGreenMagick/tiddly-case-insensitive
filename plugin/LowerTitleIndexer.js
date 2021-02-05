/*\
title: $:/plugins/bluegreen/case-insensitive/LowerTitleIndexer.js
type: application/javascript
module-type: indexer

Add LowerTitleIndexer
It creates a hashmap of {title.toLowerCase(): title}.
\*/

(function() {
  "use strict";

  function LowerTitleIndexer(wiki) {
    this.wiki = wiki;
    this.index = Object.create(null);
  }

  LowerTitleIndexer.prototype.init = function() {
    this.build();
  };
  LowerTitleIndexer.prototype.rebuild = function() {
    this.index = Object.create(null);
    this.build();
  };
  LowerTitleIndexer.prototype.build = function() {
    const self = this;
    this.wiki.each(function(tiddler, title) {
      const loweredTitle = title.toLowerCase();
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
