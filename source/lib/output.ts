import { format } from 'node:util';

export enum OutputFormat {
  'JSON' = 'JSON',
  'TEXT' = 'TEXT',
}
export type OutputFormatString = keyof typeof OutputFormat;

export function print(...args: unknown[]) {
  return process.stdout.write(format(...args));
}

export function printF(format: OutputFormatString, ...args: unknown[]) {
  switch (format) {
    case OutputFormat.JSON:
      print(JSON.stringify(args[0]));
      break;
    case OutputFormat.TEXT:
      print(...args);
      break;
  }
}
