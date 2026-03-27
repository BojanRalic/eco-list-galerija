import { applySelectionUpdate } from '@/lib/selection'

test('add id to empty list', () => {
  expect(applySelectionUpdate([], 'img-1', 'add')).toEqual(['img-1'])
})

test('remove existing id', () => {
  expect(applySelectionUpdate(['img-1', 'img-2'], 'img-1', 'remove')).toEqual(['img-2'])
})

test('add duplicate id does not duplicate', () => {
  expect(applySelectionUpdate(['img-1'], 'img-1', 'add')).toEqual(['img-1'])
})

test('remove non-existing id is no-op', () => {
  expect(applySelectionUpdate(['img-1'], 'img-2', 'remove')).toEqual(['img-1'])
})
