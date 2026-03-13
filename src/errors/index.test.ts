import { describe, expect, test } from 'bun:test';
import { JsonParseError, TerminalError, getErrorOrUndefined } from './index';

describe('TerminalError', () => {
  test('sets name, command, exitCode, and message', () => {
    const err = new TerminalError('failed', { command: 'ls', exitCode: 1 });
    expect(err.name).toBe('TerminalError');
    expect(err.command).toBe('ls');
    expect(err.exitCode).toBe(1);
    expect(err.message).toBe('failed');
  });

  test('accepts null exitCode', () => {
    const err = new TerminalError('failed', { command: 'ls', exitCode: null });
    expect(err.exitCode).toBeNull();
  });

  test('forwards cause to Error', () => {
    const cause = new Error('root');
    const err = new TerminalError('failed', { command: 'ls', exitCode: 1, cause });
    expect(err.cause).toBe(cause);
  });

  test('is an instance of Error', () => {
    const err = new TerminalError('failed', { command: 'ls', exitCode: 0 });
    expect(err).toBeInstanceOf(Error);
  });
});

describe('JsonParseError', () => {
  test('sets name, json, and message', () => {
    const err = new JsonParseError('bad json', { json: 'invalid' });
    expect(err.name).toBe('JsonParseError');
    expect(err.json).toBe('invalid');
    expect(err.message).toBe('bad json');
  });

  test('is an instance of Error', () => {
    const err = new JsonParseError('bad json', { json: '' });
    expect(err).toBeInstanceOf(Error);
  });
});

describe('getErrorOrUndefined', () => {
  test('returns an Error instance unchanged', () => {
    const err = new Error('test');
    expect(getErrorOrUndefined(err)).toBe(err);
  });

  test('returns undefined for a string', () => {
    expect(getErrorOrUndefined('oops')).toBeUndefined();
  });

  test('returns undefined for a number', () => {
    expect(getErrorOrUndefined(42)).toBeUndefined();
  });

  test('returns undefined for null', () => {
    expect(getErrorOrUndefined(null)).toBeUndefined();
  });

  test('returns undefined for undefined', () => {
    expect(getErrorOrUndefined(undefined)).toBeUndefined();
  });
});
