/*\
title: $:/plugins/bluegreen/case-insensitive/LowerLinkWidget.js
type: application/javascript
module-type: widget

Override link widget.
\*/

(function() {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    var LinkWidget = require("$:/core/modules/widgets/link.js").link;

    function LowerLinkWidget(parseTreeNode, options) {
        LinkWidget.call(this, parseTreeNode, options);
    };

    LowerLinkWidget.prototype = Object.create(LinkWidget.prototype);

    LowerLinkWidget.prototype.execute = function() {
        var returnVal = LinkWidget.prototype.execute.call(this);
        var realTo = this.wiki.getIndexer("LowerTitleIndexer").lookup(this.to);
        if (realTo) {
            this.to = realTo
            this.isMissing = !this.wiki.tiddlerExists(this.to);
            this.isShadow = this.wiki.isShadowTiddler(this.to);
        }

        return returnVal
    }

    exports.link = LowerLinkWidget;
})();