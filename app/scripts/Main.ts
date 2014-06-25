/// <reference path="../typings/mock.d.ts" />
/// <reference path="./ItemSelection.ts" />
///<reference path="../bower_components/types/jquery/jquery.d.ts" />

'use strict';

require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrapAffix: '../bower_components/sass-bootstrap/js/affix',
        bootstrapAlert: '../bower_components/sass-bootstrap/js/alert',
        bootstrapButton: '../bower_components/sass-bootstrap/js/button',
        bootstrapCarousel: '../bower_components/sass-bootstrap/js/carousel',
        bootstrapCollapse: '../bower_components/sass-bootstrap/js/collapse',
        bootstrapPopover: '../bower_components/sass-bootstrap/js/popover',
        bootstrapScrollspy: '../bower_components/sass-bootstrap/js/scrollspy',
        bootstrapTab: '../bower_components/sass-bootstrap/js/tab',
        bootstrapTooltip: '../bower_components/sass-bootstrap/js/tooltip',
        bootstrapTransition: '../bower_components/sass-bootstrap/js/transition',
        bootstrapModal: '../bower_components/sass-bootstrap/js/modal'
    },
    shim: {
        bootstrapAffix: {
            deps: ['jquery']
        },
        bootstrapAlert: {
            deps: ['jquery']
        },
        bootstrapButton: {
            deps: ['jquery']
        },
        bootstrapCarousel: {
            deps: ['jquery']
        },
        bootstrapCollapse: {
            deps: ['jquery']
        },
        bootstrapPopover: {
            deps: ['jquery']
        },
        bootstrapScrollspy: {
            deps: ['jquery']
        },
        bootstrapTab: {
            deps: ['jquery']
        },
        bootstrapTooltip: {
            deps: ['jquery']
        },
        bootstrapTransition: {
            deps: ['jquery']
        },
        bootstrapModal: {
            deps: ['jquery']
        }
    }
});

require(["scripts/ItemSelection.js", "ItemMirror", "jquery", "bootstrapModal"], function (ItemMirrorModule: any, ItemMirror, $) {
  var dropboxClient = new Dropbox.Client({
    key: "cslj0tse3k9pumc"
  });
  dropboxClient.authDriver(new Dropbox.AuthDriver.Redirect({
    rememberUser: true
  }));
  dropboxClient.authenticate(function (error, client) {
    if (error) { throw error; }

    new ItemMirror({
      groupingItemURI: "/",
      xooMLDriver: {
        driverURI: "DropboxXooMLUtility",
        dropboxClient: dropboxClient
      },
      itemDriver: {
        driverURI: "DropboxItemUtility",
        dropboxClient: dropboxClient
      }
    }, function (error, itemMirror) {
      if (error) { throw error; }
        var id = 'itemMirrorSelection';	
        var $modalContent = $('<div>',{'id': id, class: 'modal-content'});
        var $modalDialog = $('<div>', {class: 'modal-dialog modal-lg'}).append($modalContent);
        var $modal = $('<div>').append($modalDialog);
        $('body').append($modal);
        
      //picoModal({
      //  content: "<div id='itemMirrorSelection'></div>",
      //  width: "1000"
      //});

      //TODO: Typesafety
      new ItemMirrorModule.ItemSelection(itemMirror, "itemMirrorSelection");
    });
  });
});
