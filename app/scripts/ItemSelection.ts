///<reference path="../bower_components/types/jquery/jquery.d.ts" />

export class ItemSelection {
  
  private nav: JQuery;
  private list: JQuery;
  private listPath: JQuery;
  private previousGroupingItem: JQuery;
  private static itemMirrorGUID: string = "data-item-mirror-guid";
  public groupingItem: string;
  public destURL: string;

  // TODO: type of itemMirror
  constructor(
    private itemMirror: any,
    private id: string,
    private URL: string,
    private listClass: string = "itemMirrorList",
    private listPathClass: string = "itemMirrorListPath",
    private listItemClass: string = "itemMirrorListItem",
    private previousItemMirrorClass: string = "previousItemMirror") {
    this.destURL = URL;

    this.nav = $("#" + id);
    this.previousGroupingItem = $("<button class='" + this.previousItemMirrorClass + "'></button>");
    this.listPath = $("<p class='nav-header " + this.listPathClass + "'></p>");
    this.list = $("<ul class='nav nav-list" + this.listClass +"'></ul>");

    this.nav.append(this.listPath);
    this.nav.append(this.list);
    //this.loadItemMirror();
    this.groupingItem = this.selectGroup();
  }

  private loadItemMirror(GUID?: string): any {
    if (GUID) {
     this.itemMirror.createItemMirrorForAssociatedGroupingItem(GUID, (error, itemMirror) => {
        return this.createListFromAssociations(itemMirror);
      })
    } else {
      return this.createListFromAssociations(this.itemMirror);
    }
  }

  public selectGroup(): any{
    return this.loadItemMirror();
  }

  private createListFromAssociations(itemMirror: any): any {
    var self: ItemSelection = this;
    var listItemClick = function () { self.listItemClick($(this)) };
    $('a#upOneLvl').remove();
    this.list.empty();
    itemMirror.getGroupingItemURI((error, groupingItemURI) => {
      this.listPath.text("Path: " + groupingItemURI + " ");
      $('button#selectButton').remove();
      var selectButton = $('<button>', {class: "btn btn-default", text: "Select this GroupingItem", id: "selectButton"}).click((e) => {
        $('#selectionModal').remove();
        window.location.assign(this.destURL + "#" +groupingItemURI);
        return groupingItemURI;
      });
      this.listPath.append(selectButton);
    });
      //Check for and Insert up one level button
      if(!$('a#upOneLvl').length){
        itemMirror.getParent((error, parent) => {
          if(parent){
          var upOne = $("<a href='#' id='upOneLvl'><span class='glyphicon glyphicon-arrow-left'></span> Up One Level</a>");
            upOne.click((e) => {
              e.preventDefault();
              return self.createListFromAssociations(parent)
            });
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

  private listItemClick(element: JQuery): any {
    var GUID = element.attr(ItemSelection.itemMirrorGUID);
    this.list.children().remove();
    return this.loadItemMirror(GUID);
  }

}



