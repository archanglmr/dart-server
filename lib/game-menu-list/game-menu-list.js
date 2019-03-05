'use strict';

/**
 * This class manages GameMenuItems and state.
 */
module.exports = class GameMenuList {
  constructor({parent = null, children = []}) {
    this.visible = false;
    this.parent = parent;
    this.children = children;
    this.currentIndex = false; // index of the current active child

    this.highlightChild(this.findNextEnabledIndex(0))
  }

  addChild(child) {
    this.children.push(child);
  }

  highlightChild(index) {
    // @todo: needs to check index is valid

    if (false !== this.currentIndex && index !== this.currentIndex) {
      this.children[this.currentIndex].highlighted = false;
    }
    this.currentIndex = index;
    if (false !== this.currentIndex) {
      this.children[this.currentIndex].highlighted = true;
    }
  }

  actionPrevious() {
    if (this.visible) {
      let index = this.findPreviousEnabledIndex(this.currentIndex - 1);

      if (false !== index) {
        this.highlightChild(index);
        return true;
      }
    }
    return false;
  }

  actionNext() {
    if (this.visible) {
      let index = this.findNextEnabledIndex(this.currentIndex + 1);

      if (false !== index) {
        this.highlightChild(index);
        return true;
      }
    }
    return false;
  }

  actionParent() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
    return true;
  }

  actionChild() {
    if (this.visible) {
      let index = this.currentIndex;
      if (false !== index && this.children[index].enabled) {
        console.log(this.children[index].command + '(' + this.children[index].value + ')');
        return {
          action: this.children[index].command,
          value: this.children[index].value
        }
      }
      this.hide();
      return true;
    }
    return false;
  }

  findPreviousEnabledIndex(startIndex) {
    var childCount = this.children.length;

    if (startIndex >= 0 && startIndex < childCount) {
      for (let i = startIndex; i >= 0; i -= 1) {
        if (this.children[i].enabled && !this.children[i].title) {
          return i;
        }
      }
    }
    return false;
  }

  findNextEnabledIndex(startIndex) {
    for (let i = startIndex, c = this.children.length; i < c; i += 1) {
      if (this.children[i].enabled && !this.children[i].title) {
        return i;
      }
    }
    return false;
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  isVisible() {
    return this.visible;
  }

  toJson() {
    var menu = [];
    if (this.children.length) {
      for (let i = 0, c = this.children.length; i < c; i += 1) {
        menu.push(this.children[i].toJson());
      }
    }

    return menu;
  }
};