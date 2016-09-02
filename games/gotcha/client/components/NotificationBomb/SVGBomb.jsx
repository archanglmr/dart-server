'use strict';

import React, {PropTypes} from 'react';


function SVGBomb({text}) {
  /*
  * src: http://www.flaticon.com/free-icon/bomb_32128
  **/
  return (
      <svg className="svg-bomb" viewBox="0 0 385 555">
        <g transform="translate(-85 0)">
          <path className="spark" d="M366.84,77.233l-23.117,10.923l20.776-14.919L366.84,77.233z"/>
          <path className="spark" d="M376.444,48.616l-20.516-17.564l17.212,20.8L376.444,48.616z"/>
          <path className="spark" d="M422.667,0L394.13,44.561l4.001,2.323L422.667,0z"/>
          <path className="spark" d="M402.96,56.628l59.977-4.992l-60.188,0.375L402.96,56.628z"/>
        </g>
        <g transform="translate(-85 0)">
          <path className="bomb" d="M379.56,65.291
		c2.755,45.734,53.641,84.799,32.06,131.564c-6.655,14.425-19.209,24.024-30.038,35.095l-18.631-16.651l-20.877,23.356
		c-25.038-14.824-54.237-23.356-85.449-23.356c-92.834,0-168.087,75.263-168.087,168.085c0,92.834,75.259,168.09,168.087,168.09
		c92.832,0,168.087-75.256,168.087-168.09c0-36.671-11.78-70.574-31.711-98.201l21.385-23.933l-22.331-19.943
		c1.738-1.883,3.6-3.753,5.598-5.642c13.885-13.134,24.819-26.262,31.031-44.627c15.587-46.036-32.609-82.139-35.222-125.748
		C392.906,56.407,379.021,56.35,379.56,65.291z"/>

          <text textAnchor="middle" alignmentBaseline="middle" transform="translate(260 390)">{text}</text>
        </g>
      </svg>

  );
}

SVGBomb.propTypes = {
  player: PropTypes.string
};

export default SVGBomb;