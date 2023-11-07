/* eslint-disable import/namespace */
import * as narcissusHooks from '..';

describe('narcissusHooks', () => {
  test('exports modules should be defined', () => {
    Object.keys(narcissusHooks).forEach((module) => {
      expect(narcissusHooks[module]).toBeDefined();
    });
  });
});
