import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService, 
    private readonly configService: ConfigService, 
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 1000 * 1000 * 4 }, // 4MB
    storage: diskStorage({
      destination: './static/products/',
      filename: fileNamer
    })

  }))
  uploadFileProduct( 
    @UploadedFile() file: Express.Multer.File
  ) {
    if(!file) throw new BadRequestException("Make sure that the file is an image.")

    // const secureUrl = `${ file.filename }`
    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename} `

    return {
      "secureUrl" : secureUrl
    };
  }
}
