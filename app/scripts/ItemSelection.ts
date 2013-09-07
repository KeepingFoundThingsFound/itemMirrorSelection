///<reference path="../bower_components/types/jquery/jquery.d.ts" />

export class ItemSelection {

  private nav: any;
  private list: any;

  constructor(private itemMirror,
    private id: string) {

    this.nav = $(document.getElementById(id));
    this.itemMirror.listAssociations((error, GUIDs) => {
      this.list = $('<ul class="nav nav-list _itemMirrorSelectionList"></ul>');
      this.nav.append(this.list);
      this.list.append('<li class="nav-header _itemMirrorSelectionPath"></li>')

      this.itemMirror.getGroupingItemURI((error, groupingItemURI) => {
        this.nav.find("._itemMirrorSelectionPath").text("Current Path: " + groupingItemURI);
      });

      //TODO: Implement folder selection
      for (var i = 0; i < GUIDs.length; i += 1) {
        var GUID = GUIDs[i];

        this.itemMirror.getAssociationDisplayText(GUID, (error, displayName) => {
          this.list.append('<li><a href="#">' + displayName + '</a></li>');
        });
      }
    });
  }
}
