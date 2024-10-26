import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async find_user_by_id(stdId:string){
    try {
      const user = await prisma.user.findUnique({
        where:{
          studentId:stdId
        }
      })
      if(!user){
        return null
      }
      return user
    } catch (error) {
      throw new Error(error)
    }
  }

}
