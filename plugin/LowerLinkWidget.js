/*\
title: $:/plugins/bluegreen/case-insensitive/LowerLinkWidget.js
type: application/javascript
module-type: widget

Override link widget.
\*/

(function() {
  "use strict";

  const LinkWidget = require("$:/core/modules/widgets/link.js").link;

  function LowerLinkWidget(parseTreeNode, options) {
    LinkWidget.call(this, parseTreeNode, options);
  }

  LowerLinkWidget.prototype = Object.create(LinkWidget.prototype);

  LowerLinkWidget.prototype.execute = function() {
    const returnVal = LinkWidget.prototype.execute.call(this);
    const realTo = this.wiki.getIndexer("LowerTitleIndexer").lookup(this.to);
    if (realTo) {
      this.to = realTo;
      this.isMissing = !this.wiki.tiddlerExists(this.to);
      this.isShadow = this.wiki.isShadowTiddler(this.to);
    }

    return returnVal;
  };
  LowerLinkWidget.prototype.refresh = function(changedTiddlers) {
    const changedAttributes = this.computeAttributes();
    if (changedAttributes.to ||
        Object.keys(changedTiddlers)
            .map((t) => t.toLowerCase())
            .includes(this.to.toLowerCase()) ||
        changedAttributes["aria-label"] ||
        changedAttributes.tooltip
    ) {
      this.refreshSelf();
      return true;
    }
    return this.refreshChildren(changedTiddlers);
  };

  exports.link = LowerLinkWidget;
})();
