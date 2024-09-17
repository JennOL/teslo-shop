import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
     @InjectRepository(User)
     private readonly userRepository: Repository<User>,

     private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    
    try {
      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);

      delete user.password;

      return {
        ...user,
        token: this.getJWTToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBErrors(error);
    }    
  }

  async Login({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: [ 'email', 'password', 'id' ]
    });

    if(!user) 
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) 
      throw new UnauthorizedException('Invalid credentials');

    return {
      ...user,
      token: this.getJWTToken({ id: user.id })
    };
  }

  private getJWTToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if(error.code == '23505') {
      throw new BadRequestException('User already exists');

    }else{
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
