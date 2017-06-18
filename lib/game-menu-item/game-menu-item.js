'use strict';

/**
 * This class represents one GameMenuItem.
 */
module.exports = class GameMenuItem {
  constructor({label, enabled = true, highlighted = false, title = false, selected = false, command = null, value = null}) {
    this.label = label;
    this.enabled = enabled;
    // means physically highlight for navigation but don't run command or show children
    this.highlighted = highlighted;
    this.title = title;


    this.command = command;
    // OR (adding children implies no command)

    // selected means it's showing it's child menu
    this.selected = selected;
    this.children = [];


    // OPTIONAL: will be passed with a command or will represent the menu items
    // value when combining children to make a command
    this.value = value; // optional

    //this.icon = '';
    //this.description = null;
  }

  toJson() {
    var menu = {
      label: this.label,
      enabled: this.enabled,
      highlighted: this.highlighted,
      title: this.title,
      selected: this.selected
    };

    if (null !== this.command) {
      menu.command = this.command;
    } else if (this.children.length) {
      menu.children = [];
      for (let i = 0, c = this.children.length; i < c; i += 1) {
        menu.children.push(this.children[i].toJson());
      }
    }

    if (null !== this.value) {
      menu.value = this.value;
    }
    return menu;
  }
};