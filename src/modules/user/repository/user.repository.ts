  import { Repository } from 'typeorm';
  import { Injectable, Logger } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { UserEntity } from '../entity/user.entity';
  import { CreateUserDTO, createUserWithGithubDto, createUserWithGoogleDto } from '../dto/createUser.dto';
  import { CreateUser, CreateUserGithub, CreateUserGoogle, GetUser, UserRole } from '../../../shared/interface'

  @Injectable()
  export class UserRepository {
    private logger = new Logger(UserRepository.name);
  
    constructor(
      @InjectRepository(UserEntity)
      private readonly userRepo: Repository<UserEntity>,
    ) {}
  
    async createUser(userCreate: CreateUserDTO): Promise<CreateUser> {
      try {
        const { userName, email, password, role, image } = userCreate;
        const user = this.userRepo.create({ userName, email, password, role: role ?? UserRole.USER, image });
        const savedUser = await this.userRepo.save(user);
        return { ...savedUser, role: savedUser.role as UserRole };
      } catch (error) {
        this.logger.error('Error creating user', error.stack);
        throw error;
      }
    }
  
    async createUserWithGoogle(userCreate: createUserWithGoogleDto): Promise<CreateUserGoogle> {
      try {
        const { userName, email, image } = userCreate;
        const user = this.userRepo.create({ userName, email, role: UserRole.USER, image });
        const savedUser = await this.userRepo.save(user);
        return { ...savedUser, role: savedUser.role as UserRole };
      } catch (error) {
        this.logger.error('Error creating user with Google', error.stack);
        throw error;
      }
    }
  
    async createUserWithGithub(userCreate: createUserWithGithubDto): Promise<CreateUserGithub> {
      try {
        const { userName, email, image } = userCreate;
        const user = this.userRepo.create({ userName, email, role: UserRole.USER, image });
        const savedUser = await this.userRepo.save(user);
        return { ...savedUser, role: savedUser.role as UserRole };
      } catch (error) {
        this.logger.error('Error creating user with GitHub', error.stack);
        throw error;
      }
    }
  
    async findAll(): Promise<GetUser[]> {
      try {
        const users = await this.userRepo.find();
        return users.map(user => ({ ...user, role: user.role as UserRole }));
      } catch (error) {
        this.logger.error('Error finding all users', error.stack);
        throw error;
      }
    }
  
    async findById(userId: string): Promise<GetUser | null> {
      try {
        const user = await this.userRepo.findOne({ where: { userId } });
        return user ? { ...user, role: user.role as UserRole } : null;
      } catch (error) {
        this.logger.error(`Error finding user by ID: ${userId}`, error.stack);
        throw error;
      }
    }
  
    async findByUserNameAndEmail(userName: string, email: string): Promise<any | null> {
      try {
        return await this.userRepo.find({ where: { userName, email } });
      } catch (error) {
        this.logger.error(`Error finding user by userName and email`, error.stack);
        throw error;
      }
    }
  
    async findByEmail(email: string): Promise<GetUser | null> {
      try {
        const user = await this.userRepo.findOne({ where: { email } });
        return user ? { ...user, role: user.role as UserRole } : null;
      } catch (error) {
        this.logger.error(`Error finding user by email: ${email}`, error.stack);
        throw error;
      }
    }
  
    async updateUserById(userId: string, userCreate: Partial<CreateUserDTO>): Promise<CreateUser | null> {
      try {
        const user = await this.userRepo.findOne({ where: { userId } });
        if (!user) {
          this.logger.warn(`User not found with ID: ${userId}`);
          return null;
        }
        Object.assign(user, {
          userName: userCreate.userName ?? user.userName,
          email: userCreate.email ?? user.email,
          password: userCreate.password ?? user.password,
        });
        const savedUser = await this.userRepo.save(user);
        return { ...savedUser, role: savedUser.role as UserRole };
      } catch (error) {
        this.logger.error(`Error updating user by ID: ${userId}`, error.stack);
        throw error;
      }
    }
  
    async deleteUserById(userId: string): Promise<boolean> {
      try {
        await this.userRepo.delete(userId);
        return true;
      } catch (error) {
        this.logger.error(`Error deleting user by ID: ${userId}`, error.stack);
        throw error;
      }
    }
  }
  
