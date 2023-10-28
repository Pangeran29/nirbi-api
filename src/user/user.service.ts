import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { RegisterDto } from 'src/auth/dto/register.dto';

export type User = any;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findUserByEmail(email: string) {
    return await this.userRepository.findUnique('email', email);
  }

  async create(createUserDto: CreateUserDto | RegisterDto) {
    return await this.userRepository.create(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
