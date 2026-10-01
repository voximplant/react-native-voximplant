import { REGEX } from './config.mts';

export function stripComments(str: string): string {
  return str
    .replace(REGEX.cleanup.BLOCK_COMMENT, '')
    .replace(REGEX.cleanup.LINE_COMMENT, '')
    .replace(REGEX.cleanup.EMPTY_LINE, '')
    .replace(REGEX.cleanup.MULTI_NEWLINE, '\n')
    .trim();
}
