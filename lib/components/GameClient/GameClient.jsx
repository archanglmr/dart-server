'use strict';

import React, {Component} from 'react';
import './GameClient.scss';


function GameClient(props) {
  return <div className="game-client">{props.children}</div>;
}

export default GameClient;