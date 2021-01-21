/*\
title: $:/plugins/bluegreen/case-insensitive/LowerTitleIndexer.js
type: application/javascript
module-type: indexer

Add LowerTitleIndexer 'lower-title' indexer.
It creates a hashmap of {lower-title: title}.
\*/

(function () {

    "use strict";

    function LowerTitleIndexer(wiki) {
        this.wiki = wiki;
        this.index = Object.create(null);
    }

    LowerTitleIndexer.prototype.init = function () {
        this.build();
    }
    LowerTitleIndexer.prototype.rebuild = function () {
        this.build();
    }
    LowerTitleIndexer.prototype.build = function () {
        var self = this
        this.wiki.each(function (tiddler, title) {
            var lowered_title = title.toLowerCase()
            if (tiddler.fields["lower-title"] != lowered_title) {
                var newTiddler = new $tw.Tiddler(tiddler, { "lower-title": lowered_title });
                self.wiki.addTiddler(newTiddler);
            }
            self.index[lowered_title] = title
        });
    }
    LowerTitleIndexer.prototype.update = function (updateDescriptor) {
        var self = this
        var oldT = updateDescriptor.old.tiddler;
        var newT = updateDescriptor.new.tiddler;
        if (oldT) {
            var oldTitle = oldT.fields["title"];
            var oldLowerTitle = oldTitle.toLowerCase();
            var idxTitle = this.index[oldLowerTitle];
            if (!idxTitle) {
                console.log("LowerTitleIndexer: Title that wasn't indexed got deleted? " + oldTitle);
            }
            if (idxTitle == oldTitle) {
                // When renaming only case, prev title is deleted after new title is added.
                // In such situations, idxTitle != oldTitle
                delete this.index[oldLowerTitle];
            } else if (!self.wiki.getTiddler(idxTitle)) {
                // Not above situation. Is a bug.
                console.log("LowerTitleIndexer: Indexed title doesn't seem to exist? " + oldTitle);
                delete this.index[oldLowerTitle];
            }
        }
        if (newT) {
            var newTitle = newT.fields["title"]
            var newLowerTitle = newTitle.toLowerCase();
            this.index[newLowerTitle] = newTitle;
        }
    }
    LowerTitleIndexer.prototype.lookup = function (title) {
        return this.index[title.toLowerCase()]
    }

    exports.LowerTitleIndexer = LowerTitleIndexer

})();