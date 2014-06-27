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
                    return _this.createListFromAssociations(itemMirror);
                });
            } else {
                return this.createListFromAssociations(this.itemMirror);
            }
        };

        ItemSelection.prototype.selectGroup = function () {
            return this.loadItemMirror();
        };

        ItemSelection.prototype.createListFromAssociations = function (itemMirror) {
            var _this = this;
            var self = this;
            var listItemClick = function () {
                self.listItemClick($(this));
            };
            $('a#upOneLvl').remove();
            itemMirror.getGroupingItemURI(function (error, groupingItemURI) {
                _this.listPath.text("Path: " + groupingItemURI + " ");
                $('button#selectButton').remove();
                var selectButton = $('<button>', { class: "btn btn-default", text: "Select this GroupingItem", id: "selectButton" }).click(function (groupingItemUri) {
                    $('#selectionModal').remove();
                });
                _this.listPath.append(selectButton);
            });

            if (!$('a#upOneLvl').length) {
                itemMirror.getParent(function (error, parent) {
                    if (parent) {
                        var upOne = $("<a href='#' id='upOneLvl'><span class='glyphicon glyphicon-arrow-left'></span> Up One Level</a>");
                        upOne.click(function (event) {
                            event.preventDefault();
                        });
                        _this.nav.prepend(upOne);
                    }
                });
            }

            itemMirror.listAssociations(function (error, GUIDs) {
                for (var i = 0; i < GUIDs.length; i += 1) {
                    var GUID = GUIDs[i];

                    itemMirror.getAssociationDisplayText(GUID, function (error, displayName) {
                        var listItem = $("<li class='" + _this.listItemClass + "'><a>" + displayName + "</a></li>");
                        listItem.attr(ItemSelection.itemMirrorGUID, GUID);
                        _this.list.append(listItem);

                        itemMirror.isAssociatedItemGrouping(GUID, function (error, isAssociatedItemGrouping) {
                            if (!isAssociatedItemGrouping) {
                                listItem.children().remove();
                            } else {
                                var listItemText = listItem.text();
                                listItem.children().add($("<a href='#'>" + listItemText + "</a>"));
                                listItem.click(listItemClick);
                            }
                        });
                    });
                }
            });
        };

        ItemSelection.prototype.listItemClick = function (element) {
            var GUID = element.attr(ItemSelection.itemMirrorGUID);
            this.list.children().remove();
            return this.loadItemMirror(GUID);
        };
        ItemSelection.itemMirrorGUID = "data-item-mirror-guid";
        return ItemSelection;
    })();
    exports.ItemSelection = ItemSelection;
});
//# sourceMappingURL=ItemSelection.js.map
