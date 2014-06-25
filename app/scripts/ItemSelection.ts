///<reference path="../bower_components/types/jquery/jquery.d.ts" />


export class ItemSelection {

  private nav: JQuery;
  private list: JQuery;
  private listPath: JQuery;
  private previousGroupingItem: JQuery;
  private static itemMirrorGUID: string = "data-item-mirror-guid";

  // TODO: type of itemMirror
  constructor(
    private itemMirror: any,
    private id: string,
    private listClass: string = "itemMirrorList",
    private listPathClass: string = "itemMirrorListPath",
    private listItemClass: string = "itemMirrorListItem",
    private previousItemMirrorClass: string = "previousItemMirror") {

    this.nav = $("#" + id);
    this.previousGroupingItem = $("<button class='" + this.previousItemMirrorClass + "'></button>");
    this.listPath = $("<p class='nav-header " + this.listPathClass + "'></p>");
    this.list = $("<ul class='nav nav-list" + this.listClass +"'></ul>");

    this.nav.append(this.listPath);
    this.nav.append(this.list);
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

  private createListFromAssociations(itemMirror: any): void {
    var self: ItemSelection = this;
    var listItemClick = function () { self.listItemClick($(this)) };
    $('a#upOneLvl').remove();
    itemMirror.getGroupingItemURI((error, groupingItemURI) => {
      this.listPath.text("Path: " + groupingItemURI);
    });
      //Check for and Insert up one level button
      if(!$('a#upOneLvl').length){
        itemMirror.getParent((error, parent) => {
          if(parent){
          var upOne = $("<a href='#' id='upOneLvl'><span class='glyphicon glyphicon-arrow-left'></span> Up One Level</a>");
          upOne.click(function(event){
            event.preventDefault();
            self.createListFromAssociations(parent)});
            this.nav.prepend(upOne);
          }
        });
      }
  
    itemMirror.listAssociations((error, GUIDs) => {
      for (var i = 0; i < GUIDs.length; i += 1) {
        var GUID = GUIDs[i];

        itemMirror.getAssociationDisplayText(GUID, (error, displayName) => {
          var listItem = $("<li class='" + this.listItemClass + "'><a>" + displayName + "</a></li>");
          listItem.attr(ItemSelection.itemMirrorGUID, GUID);
          this.list.append(listItem);
          
          itemMirror.isAssociatedItemGrouping(GUID, (error, isAssociatedItemGrouping) => {
            if (!isAssociatedItemGrouping) {
              listItem.children().remove();
            }else{
              var listItemText = listItem.text();
              listItem.children().add($("<a href='#'>" + listItemText + "</a>"));
              listItem.click(listItemClick);
            }
          });
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



