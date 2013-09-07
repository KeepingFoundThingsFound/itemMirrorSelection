define(["require", "exports"], function(require, exports) {
    var ItemSelection = (function () {
        function ItemSelection(itemMirror, id) {
            var _this = this;
            this.itemMirror = itemMirror;
            this.id = id;
            this.nav = $(document.getElementById(id));
            this.itemMirror.listAssociations(function (error, GUIDs) {
                _this.list = $('<ul class="nav nav-list _itemMirrorSelectionList"></ul>');
                _this.nav.append(_this.list);
                _this.list.append('<li class="nav-header _itemMirrorSelectionPath"></li>');

                _this.itemMirror.getGroupingItemURI(function (error, groupingItemURI) {
                    _this.nav.find("._itemMirrorSelectionPath").text("Current Path: " + groupingItemURI);
                });

                for (var i = 0; i < GUIDs.length; i += 1) {
                    var GUID = GUIDs[i];

                    _this.itemMirror.getAssociationDisplayText(GUID, function (error, displayName) {
                        _this.list.append('<li><a href="#">' + displayName + '</a></li>');
                    });
                }
            });
        }
        return ItemSelection;
    })();
    exports.ItemSelection = ItemSelection;
});
//# sourceMappingURL=ItemSelection.js.map
