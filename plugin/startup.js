/*\
title: $:/plugins/bluegreen/case-insensitive/startup.js
type: application/javascript
module-type: startup

Add 'lower-title' field to tiddles when saving.
\*/

(function () {

    "use strict";

    exports.name = "case-insensitive-startup";

    function onRename(newT, oldT) {
        return newT.setLowerTitle();
    }
    function onImport(newT, oldT) {
        return newT.setLowerTitle();
    }
    function onSave(newT, oldT) {
        return newT.setLowerTitle();
    }

    $tw.hooks.addHook("th-renaming-tiddler", onRename);
    $tw.hooks.addHook("th-importing-tiddler", onImport);
    $tw.hooks.addHook("th-saving-tiddler", onSave);


})();