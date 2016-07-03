'use strict';

class State {
  /**
   * Gets the player info object from the game state.
   *
   * @param state
   * @param id
   * @returns {*|bool}
   */
  static getPlayer(state, id) {
    if (state.players && state.players.data && state.players.data[id]) {
      return state.players.data[id];
    }
    return false;
  }

  /**
   * Checks the global/common state to make sure the game is in play and a valid
   * round. This does not check if the game is locked.
   *
   * @param state
   * @returns {boolean}
   */
  static isPlayable(state) {
    return State.inPlay(state) && State.validRound(state.rounds);
  }

  /**
   * Checks the global/common game state to make sure the game is in play
   *
   * @param state {object}
   * @returns {boolean}
   */
  static inPlay(state) {
    return state.started && !state.finished;
  }

  /**
   * Checks the rounds part of the games State to make sure it's a valid round
   *
   * @param rounds {object}
   * @returns {boolean}
   */
  static validRound(rounds) {
    return !rounds.limit || (rounds.current < rounds.limit);
  }

  /**
   * Gets the player id of the person with the highest score. If no high score
   * or tie then -1 is returned.
   *
   * @param players
   * @returns {number}
   */
  static getPlayerIdWithHighestScore(players) {
    var highScore = 0,
        playerId = -1,
        tied = false;

    for (let id in players) {
      if (players.hasOwnProperty(id)) {
        let player = players[id],
            score = player.score;

        if (score > highScore) {
          playerId = player.id;
          tied = false;
          highScore = score;
        } else if (score === highScore) {
          playerId = -1;
          tied = true;
        }
      }
    }
    return playerId;
  }

  /**
   * Gets the player id of the person with the lowest score. If no low score
   * or tie then -1 is returned.
   *
   * @param players
   * @returns {number}
   */
  static getPlayerIdWithLowestScore(players) {
    var lowScore = null,
        playerId = -1,
        tied = false;

    for (let id in players) {
      if (players.hasOwnProperty(id)) {
        let player = players[id],
            score = player.score;

        if (null === lowScore) {
          playerId = player.id;
          lowScore = score;
        } else if (score < lowScore) {
          playerId = player.id;
          tied = false;
          lowScore = score;
        } else if (score === lowScore) {
          playerId = -1;
          tied = true;
        }
      }
    }
    return playerId;
  }
}

module.exports = State;