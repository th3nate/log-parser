export const formatBytes = function (bytes: number): string {
  const units = ['b', 'kb', 'mb', 'gb', 'tb', 'pb'];
  let i = 0;

  for (i; bytes > 1024; i++) {
    bytes /= 1024;
  }

  return bytes.toFixed(1) + '/' + units[i];
};
