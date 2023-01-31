// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;
var Amazon;
(function (Amazon_1) {
    class Amazon extends Shortcut {
        runtime() {
            var _a;
            const storageFilename = "last-run.txt";
            const latestRunString = this["readStorage"](storageFilename);
            const latestRunTime = (_a = ((latestRunString === String()) ?
                new Date()
                : new Date(latestRunString))) !== null && _a !== void 0 ? _a : new Date();
            this["writeStorage"]((new Date()).toISOString(), storageFilename);
            return (Date.now() - latestRunTime.getTime()) > 300000;
        }
    }
    Amazon_1.Amazon = Amazon;
})(Amazon || (Amazon = {}));
(new Amazon.Amazon())["run"]();
//# sourceMappingURL=Amazon.js.map