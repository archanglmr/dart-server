'use strict';

import React, {PropTypes} from 'react';
import './WidgetCricketDisplay.scss';

function WidgetCricketDisplay({targets, players, playersDb}) {
  var playerColumns = {},
      targetColumn = (
          <div className="column" key="cricket_display_targets">
            <div className="row name"></div>
            {buildTargetRows(targets)}
          </div>
      ),
      currentPlayer = playersDb.current,
      columns = [];

  for (let i = 0, c = players.length; i < c; i += 1) {
    let id = players[i].id,
        className = ['column'];

    if (currentPlayer === id) {
      className.push('current');
    }
    columns.push(playerColumns[id] = (
      <div className={className.join(' ')} key={'cricket_display_' + id}>
        <div className="row name">{playersDb.data[id].displayName}</div>
        {buildPlayerRows(targets, players[i])}
      </div>
    ));
  }



  return (
      <div className="widget-cricket-display">
        {targetColumn}
        {columns}
      </div>
  );
}

WidgetCricketDisplay.propTypes = {
  targets: PropTypes.array.isRequired,
  players: PropTypes.array.isRequired,
  playersDb: PropTypes.shape({
    current: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired
  })
};

export default WidgetCricketDisplay;



function buildPlayerRows(targets, player) {
  var rows = [];
  for (let i = 0, c = targets.length; i < c; i += 1) {
    let target = targets[i],
        className = ['row'];

    if (!target.open) {
      className.push('closed');
    }
    let marks = player.marks[target.number],
        display = '';

    if (1 === marks) {
      display = '/';
    } else if (2 === marks) {
      display = 'X';
    } else if (marks > 2) {
      display = 'O';
    }
    rows.push(
        <div key={'cricket_display_' + target.number + '_' + player.id} className={className.join(' ')}>
          {display}
        </div>
    );
  }
  return rows;
}


function buildTargetRows(targets) {
  var rows = [];
  for (let i = 0, c = targets.length; i < c; i += 1) {
    let target = targets[i],
        className = ['row'];

    if (!target.open) {
      className.push('closed');
    }
    rows.push(
      <div key={'cricket_display_targets_' + target.number} className={className.join(' ')}>
        {(21 == target.number ? 'BULL' : target.number)}
      </div>
    );
  }
  return rows;
}