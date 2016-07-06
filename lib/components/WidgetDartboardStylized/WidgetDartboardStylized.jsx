'use strict';

import React, {PropTypes} from 'react';
import Slice from './Slice.jsx';
import './WidgetDartboardStylized.scss';


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

function WidgetDartboardStylized({dartboard}) {
  var order = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5],
      bullClassNames = {
        double: ['dark', 'double'],
        outer: ['light', 'single']
      },
      className = ['widget-dartboard', 'widget-dartboard-stylized'];

  if (!dartboard.visible) {
    className.push('hidden');
  }
  if (dartboard.highlight) {
    className.push('highlight');
  }
  if (dartboard.backdrop) {
    className.push('backdrop');
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
    <svg className={className.join(' ')} version="1.1" x="0px" y="0px" width="1000px" height="1000px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
      <g className="backdrop">
        <circle className="outer" fill="black" cx="500" cy="500" r="550"></circle>
        <circle className="inner" fill="white" cx="500" cy="500" r="435"></circle>
      </g>
      <g class="island">
        {order.map((value, i) => <Slice
            key={value}
            number={value}
            degrees={(i * 18) - 9}
            dark={!!((i + 1) % 2)}
            hide={dartboard.hide ? dartboard.hide[value] : null}
            blink={dartboard.blink ? dartboard.blink[value] : null}
            highlight={dartboard.highlight ? dartboard.highlight[value] : null}
            />
        )}
      </g>
      <g className="sector sector_bull">
        <path className={bullClassNames.outer.join(' ')} d="M500,598.92a98.42,98.42,0,1,1,98.42-98.42A98.42,98.42,0,0,1,500,598.92Zm0-49.38a49,49,0,1,0-49-49A49,49,0,0,0,500,549.54Z" />
        <circle className={bullClassNames.double.join(' ')} cx="500" cy="500" r="43"></circle>
      </g>
    </svg>
  );
}

WidgetDartboardStylized.propTypes = {
  dartboard: PropTypes.shape({
    visible: PropTypes.bool,
    hide: PropTypes.object,
    blink: PropTypes.object,
    highlight: PropTypes.object
  })
};

export default WidgetDartboardStylized;