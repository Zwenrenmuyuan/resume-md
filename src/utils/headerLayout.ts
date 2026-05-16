import type { HeaderItem } from '../types/schema';

export const MAX_HEADER_ROWS = 3;

export type HeaderMoveDirection = 'left' | 'right' | 'up' | 'down';

export function buildDefaultHeaderRows(items: HeaderItem[]): string[][] {
  const ids = items.map((item) => item.id);
  const primaryIds = ids.slice(0, 2);
  const secondaryIds = ids.slice(2);

  return [primaryIds, secondaryIds].filter((row) => row.length > 0);
}

export function appendHeaderItem(rows: string[][], itemId: string): string[][] {
  if (rows.length === 0) return [[itemId]];

  const next = rows.map((row) => [...row]);
  next[next.length - 1].push(itemId);
  return next;
}

export function removeHeaderItem(rows: string[][], itemId: string): string[][] {
  return compactHeaderRows(rows.map((row) => row.filter((id) => id !== itemId)));
}

export function canMoveHeaderItem(
  rows: string[][],
  itemId: string,
  direction: HeaderMoveDirection
): boolean {
  const position = findHeaderItem(rows, itemId);
  if (!position) return false;

  const { rowIndex, itemIndex } = position;

  switch (direction) {
    case 'left':
      return itemIndex > 0;
    case 'right':
      return itemIndex < rows[rowIndex].length - 1;
    case 'up':
      return rowIndex > 0;
    case 'down':
      if (rowIndex >= MAX_HEADER_ROWS - 1) return false;
      if (rowIndex + 1 < rows.length) return true;
      return rows[rowIndex].length > 1;
  }
}

export function moveHeaderItem(
  rows: string[][],
  itemId: string,
  direction: HeaderMoveDirection
): string[][] {
  if (!canMoveHeaderItem(rows, itemId, direction)) return rows;

  const next = rows.map((row) => [...row]);
  const position = findHeaderItem(next, itemId);
  if (!position) return rows;

  const { rowIndex, itemIndex } = position;

  switch (direction) {
    case 'left':
      [next[rowIndex][itemIndex - 1], next[rowIndex][itemIndex]] = [
        next[rowIndex][itemIndex],
        next[rowIndex][itemIndex - 1],
      ];
      return next;
    case 'right':
      [next[rowIndex][itemIndex], next[rowIndex][itemIndex + 1]] = [
        next[rowIndex][itemIndex + 1],
        next[rowIndex][itemIndex],
      ];
      return next;
    case 'up': {
      const [item] = next[rowIndex].splice(itemIndex, 1);
      next[rowIndex - 1].push(item);
      return compactHeaderRows(next);
    }
    case 'down': {
      const [item] = next[rowIndex].splice(itemIndex, 1);
      if (!next[rowIndex + 1]) next[rowIndex + 1] = [];
      next[rowIndex + 1].push(item);
      return compactHeaderRows(next);
    }
  }
}

function compactHeaderRows(rows: string[][]): string[][] {
  return rows.filter((row) => row.length > 0).slice(0, MAX_HEADER_ROWS);
}

function findHeaderItem(rows: string[][], itemId: string) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const itemIndex = rows[rowIndex].indexOf(itemId);
    if (itemIndex >= 0) return { rowIndex, itemIndex };
  }
  return null;
}
