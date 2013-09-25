define(["require", "exports"], function(require, exports) {
    var ItemSelection = (function () {
        function ItemSelection(itemMirror, id, listClass, listPathClass, listItemClass, previousItemMirrorClass) {
            if (typeof listClass === "undefined") { listClass = "itemMirrorList"; }
            if (typeof listPathClass === "undefined") { listPathClass = "itemMirrorListPath"; }
            if (typeof listItemClass === "undefined") { listItemClass = "itemMirrorListItem"; }
            if (typeof previousItemMirrorClass === "undefined") { previousItemMirrorClass = "previousItemMirror"; }
            this.itemMirror = itemMirror;
            this.id = id;
            this.listClass = listClass;
            this.listPathClass = listPathClass;
            this.listItemClass = listItemClass;
            this.previousItemMirrorClass = previousItemMirrorClass;
            this.nav = $("#" + id);
            this.previousGroupingItem = $("<button class='" + this.previousItemMirrorClass + "'></button>");
            this.listPath = $("<p class='nav-header " + this.listPathClass + "'></p>");
            this.list = $("<ul class='nav nav-list" + this.listClass + "'></ul>");

            this.nav.append(this.listPath);
            this.nav.append(this.list);
            this.loadItemMirror();
        }
        ItemSelection.prototype.loadItemMirror = function (GUID) {
            var _this = this;
            if (GUID) {
                this.itemMirror.createItemMirrorForAssociatedGroupingItem(GUID, function (error, itemMirror) {
                    _this.createListFromAssociations(itemMirror);
                });
            } else {
                this.createListFromAssociations(this.itemMirror);
            }
        };

        ItemSelection.prototype.createListFromAssociations = function (itemMirror) {
            var _this = this;
            var self = this;
            var listItemClick = function () {
                self.listItemClick($(this));
            };

            itemMirror.getGroupingItemURI(function (error, groupingItemURI) {
                _this.listPath.text("Path: " + groupingItemURI);
            });

            itemMirror.listAssociations(function (error, GUIDs) {
                for (var i = 0; i < GUIDs.length; i += 1) {
                    var GUID = GUIDs[i];

                    itemMirror.getAssociationDisplayText(GUID, function (error, displayName) {
                        var listItem = $("<li class='" + _this.listItemClass + "'><a>" + displayName + "</a></li>");
                        listItem.attr(ItemSelection.itemMirrorGUID, GUID);
                        _this.list.append(listItem);

                        itemMirror.isAssociatedItemGrouping(GUID, function (error, isAssociatedItemGrouping) {
                            if (isAssociatedItemGrouping) {
                                listItem.click(listItemClick);
                                var listItemText = listItem.text();
                                listItem.children().remove();
                                listItem.children().add($("<a href='#'>" + listItemText + "</a>"));
                            }
                        });
                    });
                }
            });
        };

        ItemSelection.prototype.listItemClick = function (element) {
            var GUID = element.attr(ItemSelection.itemMirrorGUID);
            this.list.children().remove();
            this.loadItemMirror(GUID);
        };
        ItemSelection.itemMirrorGUID = "data-item-mirror-guid";
        return ItemSelection;
    })();
    exports.ItemSelection = ItemSelection;
});
//# sourceMappingURL=ItemSelection.js.map
