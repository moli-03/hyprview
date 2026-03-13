import { ResultAsync } from 'neverthrow';
import { Monitor } from '../types/monitor';
import { TerminalError, JsonParseError } from '../../errors';

export type HyprlandQueryError = TerminalError | JsonParseError;

export type HyprlandQueryPort = {
  getMonitors: () => ResultAsync<Monitor[], HyprlandQueryError>;
};
