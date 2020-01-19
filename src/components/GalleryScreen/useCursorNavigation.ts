import { useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { clamp } from '../../libs/utils';
import { useKey } from '../../hooks/useKey';

import { GRID_COLS } from './constants';

type Dir = 'up' | 'down' | 'left' | 'right';

const simpleMoveReducer = (current: number, move: number | Dir) => {
  if (typeof move === 'number') {
    // Absolute move
    return move;
  } else {
    // Relative move
    let x = current % GRID_COLS;
    let y = (current - x) / GRID_COLS;
    if (move === 'left') x = (x + GRID_COLS - 1) % GRID_COLS;
    if (move === 'right') x = (x + 1) % GRID_COLS;
    if (move === 'down') y += 1;
    if (move === 'up') y -= 1;
    return x + y * GRID_COLS;
  }
};

const boundedMoveReducer = (maxRef: { current: number }) => (
  current: number,
  move: number | Dir,
) => clamp(simpleMoveReducer(current, move), [0, maxRef.current - GRID_COLS]);

export const useCursorNavigation = (maxRef: { current: number }) => {
  // Read initial value from URL
  const params = useParams<{ index?: string }>();
  const [cursor, moveCursor] = useReducer(
    boundedMoveReducer(maxRef),
    Number(params.index || 0),
  );

  // Keyboard navigation
  useKey('ArrowRight', () => moveCursor('right'));
  useKey('ArrowLeft', () => moveCursor('left'));
  useKey('ArrowDown', () => moveCursor('down'));
  useKey('ArrowUp', () => moveCursor('up'));

  return cursor;
};
