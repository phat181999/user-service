import { GetUserDto } from '../dto/getUser.dto';
import { UserRepository } from '../repository/user.repository';
import { UserService } from './user.service';

describe('UserServiceTest', () => {
  let userService: UserService;
  let userRepository: Partial<UserRepository>;

  const mockUser: GetUserDto = {
    userId: '123123',
    userName: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    deletedAt: null,
  };

  beforeEach(() => {
    userRepository = {
      findAll: jest.fn().mockResolvedValue([mockUser]),
    };

    userService = new UserService(
      userRepository as UserRepository,
      { hash: jest.fn() } as any, // if needed
    );
  });

  describe('getUsers', () => {
    it('should return a list of users when repository call is successful', async () => {
      const result = await userService.getUsers();

      expect(result).toEqual([mockUser]);
      expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
