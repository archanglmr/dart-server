'use strict';

import React, {PropTypes} from 'react';
import './WidgetCricketDisplay.scss';
import CricketMark from '../CricketMark';

function WidgetCricketDisplay({targets, players, playersDb}) {
  var displayClassNames = ['widget-cricket-display'],
      playerColumns = {},
      targetColumn = (
          <div className="column targets">
            <div className="row name"></div>
            <div className="marks" children={buildTargetRows(targets)} />
          </div>
      ),
      currentPlayer = playersDb.current,
      columns = [];

  for (let i = 0, c = players.length; i < c; i += 1) {
    let id = players[i].id,
        className = ['column', ('player_' + (i + 1)), ('player_id_' + id)],
        name = playersDb.data[id].firstName.substr(0, 1) + playersDb.data[id].lastName.substr(0, 1);

    if (currentPlayer === id) {
      className.push('current');
    }
    columns.push(playerColumns[id] = (
      <div className={className.join(' ')}>
        <div className="row name">{name}</div>
        <div className="marks" children={buildPlayerRows(targets, players[i])} />
      </div>
    ));
  }

  if (columns.length > 4) {
    displayClassNames.push('narrow');
  }

  let appendEmpty = columns.length % 2;

  columns.splice(Math.ceil(columns.length / 2), 0, targetColumn);
  columns.unshift(
      <div className="column strike">
        <div className="row name" />
        <div className="marks" children={buildStrikeRows(targets)} />
      </div>
  );

  if (appendEmpty) {
    columns = [
      <div className="emptyWrapper" children={columns}/>,
      <div className="column empty" />
    ];
  }


  return (
    <div className="widget-cricket-display-container">
      <div className={displayClassNames.join(' ')} children={columns} />
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



function buildStrikeRows(targets) {
  var rows = [];
  for (let i = 0, c = targets.length; i < c; i += 1) {
    let target = targets[i],
        className = ['row'];

    if (!target.open) {
      className.push('closed');
    }
    rows.push(
        <div className={className.join(' ')}>
          <div className="line" />
        </div>
    );
  }
  return rows;
}

function buildPlayerRows(targets, player) {
  var rows = [];
  for (let i = 0, c = targets.length; i < c; i += 1) {
    let target = targets[i],
        className = ['row'],
        highlightMarks = (player.highlightMarks && player.highlightMarks[target.number]) ?
            player.highlightMarks[target.number] :
            0;

    if (!target.open) {
      className.push('closed');
    }

    rows.push(
        <div className={className.join(' ')}>
          <CricketMark marks={player.marks[target.number]} highlight={highlightMarks} />
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
    if (21 == target.number) {
      className.push('bull');
    }
    rows.push(
      <div key={'cricket_display_targets_' + target.number} className={className.join(' ')}>
        <span>{(21 == target.number ? 'BULL' : target.number)}</span>
      </div>
    );
  }
  return rows;
}