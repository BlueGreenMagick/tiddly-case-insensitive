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
    }
    LowerTitleIndexer.prototype.rebuild = function() {
        this.index = Object.create(null);
        this.build();
    }
    LowerTitleIndexer.prototype.build = function() {
        var self = this
        this.wiki.each(function(tiddler, title) {
            var lowered_title = title.toLowerCase()
            self.index[lowered_title] = title
        });
    }
    LowerTitleIndexer.prototype.update = function(updateDescriptor) {
        var self = this
        var oldT = updateDescriptor.old.tiddler;
        var newT = updateDescriptor.new.tiddler;
        if (oldT) {
            var oldTitle = oldT.fields["title"];
            var oldLowerTitle = oldTitle.toLowerCase();
            var idxTitle = this.index[oldLowerTitle];
            if (!idxTitle) {
                // for debugging purposes
                console.log("WARNING!LowerTitleIndexer: Title that wasn't indexed got modified: " + oldTitle);
            }
            delete this.index[oldLowerTitle];
        }
        if (newT) {
            var newTitle = newT.fields["title"]
            var newLowerTitle = newTitle.toLowerCase();
            this.index[newLowerTitle] = newTitle;
        }
    }
    LowerTitleIndexer.prototype.lookup = function(title) {
        return this.index[title.toLowerCase()]
    }

    exports.LowerTitleIndexer = LowerTitleIndexer

})();