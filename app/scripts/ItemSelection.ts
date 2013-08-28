///<reference path="../bower_components/types/jquery/jquery.d.ts" />

export class ItemSelection {

  private nav: any;

  constructor(private itemMirror,
    private id: string) {

    this.nav = $(document.getElementById(id));
    this.itemMirror.listAssociations((error, GUIDs) => {
      var navTemplate = "" +
        '<ul class="nav nav-list">' +
        '<li class="nav-header itemMirrorPath">List header</li>';
      for (var i = 0; i < GUIDs.length; i += 1) {
        navTemplate += '<li><a href="#">' + GUIDs[i] + '</a></li>';
      }
      navTemplate += '</ul>';
      this.nav.append(navTemplate);
      this.itemMirror.getGroupingItemURI((error, groupingItemURI) => {
        this.nav.find(".itemMirrorPath").text("Current Path: " + groupingItemURI);
      });
    });
  }
}
