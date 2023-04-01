import faker from 'faker';
import User from '../../../src/models/users/users.models';

describe('User model', () => {
  describe('User validation', () => {
    let newUser: { firstname: string; lastname: string; email: string; password: string };
    beforeEach(() => {
      newUser = {
        firstname: faker.name.findName(),
        lastname: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'RandomPassword123',
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new User(newUser).validate()).resolves.toBeUndefined();
    });

    test('should throw validation error if email is invalid', async () => {
      newUser.email = 'inValidEmail1';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw validation error if password is not alphaNum', async () => {
      newUser.password = '111111111111111';
      await expect(new User(newUser).validate()).rejects.toThrow();
      newUser.password = 'aaaaaaaaaaa';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
  });
});
