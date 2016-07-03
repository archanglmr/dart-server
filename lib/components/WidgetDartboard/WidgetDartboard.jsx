'use strict';

import React, {PropTypes} from 'react';
import Slice from './Slice.jsx';
import './WidgetDartboard.scss';


function updateBullClassNames({classNames, addClass, target}) {
  if (target) {
    for (let i = 0, c = target.length; i < c; i += 1) {
      switch(target[i].type) {
        case 'DOUBLE':
          classNames.double.push(addClass);
          break;

        case 'SINGLE_OUTER':
          classNames.outer.push(addClass);
          break;
      }
    }
  }

  return classNames;
}

function WidgetDartboard({dartboard}) {
  var order = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5],
      bullClassNames = {
        double: ['dark', 'double'],
        outer: ['light', 'single']
      },
      className = ['widget-dartboard'];

  if (!dartboard.visible) {
    className.push('hidden');
  }
  if (dartboard.highlight) {
    className.push('highlight');
  }

  if (dartboard.hide && dartboard.hide[21]) {
    bullClassNames = updateBullClassNames({classNames: bullClassNames, addClass: 'hide', target: dartboard.hide[21]});
  }
  if (dartboard.blink && dartboard.blink[21]) {
    bullClassNames = updateBullClassNames({classNames: bullClassNames, addClass: 'blink', target: dartboard.blink[21]});
  }
  if (dartboard.highlight && dartboard.highlight[21]) {
    bullClassNames = updateBullClassNames({classNames: bullClassNames, addClass: 'highlight', target: dartboard.highlight[21]});
  }



  return (
    <svg className={className.join(' ')} version="1.1" x="0px" y="0px" width="787px" height="774px" viewBox="0 0 787 774" enable-background="new 0 0 787 774">
      <g class="island">
        {order.map((value, i) => <Slice
            key={value}
            number={value}
            degrees={i * 18}
            dark={!!((i + 1) % 2)}
            hide={dartboard.hide ? dartboard.hide[value] : null}
            blink={dartboard.blink ? dartboard.blink[value] : null}
            highlight={dartboard.highlight ? dartboard.highlight[value] : null}
            />
        )}
      </g>
      <g className="sector sector_bull" transform="translate(-7.5, -2)">
        <path className={bullClassNames.outer.join(' ')} d="M432.438 389c0 17.087-13.852 30.938-30.938 30.938S370.562 406.1 370.6 389 s13.852-30.938 30.938-30.938S432.438 371.9 432.4 389z M401.5 372.602c-9.057 0-16.398 7.342-16.398 16.4 s7.342 16.4 16.4 16.398s16.398-7.342 16.398-16.398S410.557 372.6 401.5 372.602z" />
        <circle className={bullClassNames.double.join(' ')} cx="401.5" cy="389" r="13.7"></circle>
      </g>
    </svg>
  );
}

//394, 387

WidgetDartboard.propTypes = {
  dartboard: PropTypes.shape({
    visible: PropTypes.bool,
    hide: PropTypes.object,
    blink: PropTypes.object,
    highlight: PropTypes.object
  })
};

export default WidgetDartboard;