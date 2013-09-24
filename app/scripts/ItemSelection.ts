///<reference path="../bower_components/types/jquery/jquery.d.ts" />

module ItemMirror {

  export class ItemSelection {

    private nav: JQuery;
    private list: JQuery;
    private listPath: JQuery;
    private static itemMirrorGUID: string = "data-item-mirror-guid";

    // TODO: type of itemMirror
    constructor(
      private itemMirror: Object,
      private id: string,
      private listClass: string = "itemMirrorList",
      private listPathClass: string = "itemMirrorListPath",
      private listItemClass: string = "itemMirrorListItem,") {

      this.nav = $("#" + id);
      this.list = $("<ul class='nav nav-list" + this.listClass +"'></ul>");
      this.listPath = $("<p class='nav-header " + this.listPathClass + "'></p>");

      this.nav.append(this.list);
      this.nav.append(this.listPath);
      this.loadItemMirror();
    }

    private loadItemMirror(GUID?: string): void {
      if (GUID) {
       this.itemMirror.createItemMirrorForAssociatedGroupingItem(GUID, (error, itemMirror) => {
          this.createListFromAssociations(itemMirror);
        })
      } else {
        this.createListFromAssociations(this.itemMirror);
      }
    }

    private createListFromAssociations(itemMirror): void {
      var self: ItemSelection = this;

      itemMirror.listAssociations((error, GUIDs) => {
        itemMirror.getGroupingItemURI((error, groupingItemURI) => {
          this.listPath.text("Path: " + groupingItemURI);
        });

        var listItemClick = function () { self.listItemClick($(this)) };
        for (var i = 0; i < GUIDs.length; i += 1) {
          var GUID = GUIDs[i];

          itemMirror.getAssociationDisplayText(GUID, (error, displayName) => {
            var listItem = $("<li class='" + this.listItemClass + "'><a href='#'>" + displayName + "</a></li>");
            listItem.click(listItemClick);
            listItem.attr(ItemSelection.itemMirrorGUID, GUID);
            this.list.append(listItem);
          });
        }
      });
    }

    private listItemClick(element: JQuery): void {
      var GUID = element.attr(ItemSelection.itemMirrorGUID);
      this.list.children().remove();
      this.loadItemMirror(GUID);
    }

  }

}


