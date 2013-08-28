define(["require", "exports"], function(require, exports) {
    var ItemSelection = (function () {
        function ItemSelection(itemMirror, id) {
            var _this = this;
            this.itemMirror = itemMirror;
            this.id = id;
            this.nav = $(document.getElementById(id));
            this.itemMirror.listAssociations(function (error, GUIDs) {
                var navTemplate = "" + '<ul class="nav nav-list">' + '<li class="nav-header itemMirrorPath">List header</li>';
                for (var i = 0; i < GUIDs.length; i += 1) {
                    navTemplate += '<li><a href="#">' + GUIDs[i] + '</a></li>';
                }
                navTemplate += '</ul>';
                _this.nav.append(navTemplate);
                _this.itemMirror.getGroupingItemURI(function (error, groupingItemURI) {
                    _this.nav.find(".itemMirrorPath").text("Current Path: " + groupingItemURI);
                });
            });
        }
        return ItemSelection;
    })();
    exports.ItemSelection = ItemSelection;
});
//# sourceMappingURL=ItemSelection.js.map
