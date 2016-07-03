'use strict';
var fs = require('fs'),
    path = require('path');

module.exports = class GameInfo {
  constructor(gameName, gamePath) {
    this.gameName = gameName;
    this.info = false;
    this.constructor = '';

    var infoPath = path.join(gamePath, 'info.json'),
        serverPath = path.join(gamePath, 'server/'),
        serverJsFile = '';

    if (fs.existsSync(infoPath)) {
      this.info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    }
    serverJsFile = fs
        .readdirSync(serverPath)
        .filter((file) => fs.statSync(path.join(serverPath, file)).isFile() && file.match(/^DartGameServer_([-_a-zA-Z0-9]+)\.js$/));
    if (1 === serverJsFile.length) {
      this.constructor = require(path.join(serverPath, serverJsFile[0]));
    }
  }
};