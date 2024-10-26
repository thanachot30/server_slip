import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { studentData } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/webhook')
  webhook(@Body() body:any){
    try {
      console.log('body',body);
      console.log(body.originalDetectIntentRequest);
      
      return body
    } catch (error) {
      throw Error(error)
    }
  }
  @Get('/student/:id')
  async findUser(@Param('id') id:string):Promise<studentData | null>{
    try {
      const user = await this.appService.find_user_by_id(id)
      return user
    } catch (error) {
      throw Error(error)
    }
  }

  // POST route for uploading a payment slip
  @Post('/checkslip')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Path to store the files
        filename: (req, file, cb) => {
          // Modify the filename to avoid name collisions
          const fileExtName = extname(file.originalname);
          const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async checkslip(@UploadedFile() file: Express.Multer.File) {
    try {
      // file contains all the metadata of the uploaded image
      // console.log('File received:', file);
      const apiKey = process.env.API_KEY
      const filePath = path.join(__dirname, '..', 'uploads', file.filename);
      // Read the file into a buffer
      console.log(filePath);
      
      const Readfile = fs.readFileSync(filePath);

      
      const res = await axios.post("https://api.slipok.com/api/line/apikey/32234",{
        "files":Readfile,
        // "log":true,
        // "amount":500
        
      },{
        headers: {
          "x-authorization": apiKey,
          "Content-Type": "multipart/form-data"
        },
      })
      const slipData = res.data;
      console.log('Slip data:', slipData);
      
      return slipData
    } catch (error) {
      
      throw Error(`File upload failed: ${error}`);
    }
  }
}
