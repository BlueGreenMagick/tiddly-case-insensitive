/*\
title: $:/plugins/bluegreen/case-insensitive/setLowerTitle.js
type: application/javascript
module-type: tiddlermethod

Add setLowerTitle method to tiddler object.
\*/


(function () {

    "use strict";

    exports.setLowerTitle = function () {
        return new $tw.Tiddler(this, { "lower-title": this.fields["title"].toLowerCase() });
    };

})();