import * as is   from '@interactjs/utils/is';
import rectUtils from '@interactjs/utils/rect';

function start ({ rect, startOffset, state }) {
  const { options } = state;
  const { elementRect } = options;
  const offset = {};

  if (rect && elementRect) {
    offset.left = startOffset.left - (rect.width  * elementRect.left);
    offset.top  = startOffset.top  - (rect.height * elementRect.top);

    offset.right  = startOffset.right  - (rect.width  * (1 - elementRect.right));
    offset.bottom = startOffset.bottom - (rect.height * (1 - elementRect.bottom));
  }
  else {
    offset.left = offset.top = offset.right = offset.bottom = 0;
  }

  state.offset = offset;
}

function set ({ coords, interaction, state }) {
  const { options, offset } = state;
  
  const restriction = getRestrictionRect(options.restriction, interaction, coords);
  
  if (!restriction) { return state; }
  
  const rect = restriction;

  // console.log('\nrect:', rect);
  // console.log('x init:', coords.x, ' y init:', coords.y);

  // center of circle: (X, Y)
  const X = rect.width / 2 + rect.left;
  const Y = rect.height / 2 + rect.top;
  // console.log('X:', X, ' Y:', Y);

  const R = Math.min(rect.width / 2, rect.height / 2);
  const r = Math.sqrt(Math.abs(coords.x - X) ** 2 + Math.abs(coords.y - Y) ** 2);
  // console.log('R:', R, ' r:', r);

  if (r > R) {
    coords.x = (coords.x - X) * R / r + X;
    coords.y = (coords.y - Y) * R / r + Y;
  }
}

function getRestrictionRect (value, interaction, coords) {
  if (is.func(value)) {
    return rectUtils.resolveRectLike(value, interaction.target, interaction.element, [coords.x, coords.y, interaction]);
  } else {
    return rectUtils.resolveRectLike(value, interaction.target, interaction.element);
  }
}

const restrict = {
  start,
  set,
  getRestrictionRect,
  defaults: {
    enabled: false,
    restriction: null,
    elementRect: null,
  },
};

export default restrict;
