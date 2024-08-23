import { formatDuration } from './datetime';

describe('`formatDuration` helper', () => {
  it('is correct', () => {
    expect(formatDuration(45)).toEqual('0:45');
    expect(formatDuration(150)).toEqual('2:30');
    expect(formatDuration(187)).toEqual('3:07');
    expect(formatDuration(777)).toEqual('12:57');
    expect(formatDuration(3801)).toEqual('1:03:21');
    expect(formatDuration(4202)).toEqual('1:10:02');
  });
});
