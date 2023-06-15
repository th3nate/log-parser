import { Logger } from '@nestjs/common';
import * as util from 'util';

export function mongooseLogger(collectionName, methodName, ...methodArgs) {
  const logger = new Logger('DB');
  const msgMapper = (m) => {
    return util
      .inspect(m, false, 10, true)
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ');
  };
  logger.log(
    `\x1B[0;36mMongoose:\x1B[0m: ${collectionName}.${methodName}` +
      `(${methodArgs.map(msgMapper).join(', ')})`
  );
}
