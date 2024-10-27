import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { studentData } from './dto';

interface User {
  studentId: string;
  firstName: string;
  lastName: string;
  email?: string | null;
}

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
  async findUser(@Param('id') id:string){
    try {
      // const user = await this.appService.find_user_by_id(id)
      const mock_data:User[] = [
        { studentId: '112233', firstName: 'Thanachot', lastName: 'Supawasut', email: 'thanachot@gmail.com' },
      { studentId: '112244', firstName: 'Zen', lastName: 'Supawasut', email: 'zen@mail.com' },
      { studentId: '112255', firstName: 'John', lastName: 'Doe', email: 'john.doe@mail.com' },
      { studentId: '112266', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@mail.com' },
      { studentId: '112277', firstName: 'Sam', lastName: 'Smith', email: 'sam.smith@mail.com' },
      { studentId: '112288', firstName: 'Alice', lastName: 'Brown', email: 'alice.brown@mail.com' },
      { studentId: '112299', firstName: 'Bob', lastName: 'Davis', email: 'bob.davis@mail.com' },
      { studentId: '112300', firstName: 'Charlie', lastName: 'Wilson', email: 'charlie.wilson@mail.com' },
      { studentId: '112311', firstName: 'Daisy', lastName: 'Clark', email: 'daisy.clark@mail.com' },
      { studentId: '112322', firstName: 'Eve', lastName: 'Johnson', email: 'eve.johnson@mail.com' },
      ]

      const user = mock_data.find((user) => user.studentId === id);

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

      const res = await axios.post(process.env.API_SLIP,{
        "files":Readfile,
        "log":true,
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
