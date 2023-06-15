export interface Parser {
  parseLine: (line: string) => void;
  initStream: (file: Buffer, correlation: string) => void;
}
