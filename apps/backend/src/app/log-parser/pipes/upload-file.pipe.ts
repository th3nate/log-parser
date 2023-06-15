import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import * as process from 'process';

const maxSize = Number(process.env.UPLOAD_FILE_MAX_SIZE);
const fileType = process.env.UPLOAD_FILE_EXT;
export const uploadFilePipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize,
  })
  .addFileTypeValidator({
    fileType,
  })
  .build({
    fileIsRequired: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
