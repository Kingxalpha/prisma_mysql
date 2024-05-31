// import { Post,Controller, UploadedFile, UseInterceptors } from "@nestjs/common";
// import { FileInterceptor } from "@nestjs/platform-express";


// @Controller('files')
// export class FileController {
//     @Post('upload')
//     @UseInterceptors(FileInterceptor('file'))
//     uploadFile(@UploadedFile() file) {
//         if(!file) {
//             throw new Error ('No file found!!')
//         }
//         console.log(file, 'file uploaded!!!');
//     }
// }
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if(!file) throw new Error ('No file found')
    return { message: 'File uploaded successfully', filePath: `/uploads/${file.filename}` };
  }
}
