import setupTestDB from '../utils/setupTestDB';
import faker from 'faker';
import request from 'supertest';
import dolph from '../../src/servers';
import { httpStatus } from '@dolphjs/core';
import User, { IUser } from '../../src/models/users/users.models';
import { Types } from 'mongoose';

setupTestDB();

describe('Auth route', () => {
  describe('POST /api/v1/auth/register', () => {
    let newUser: { firstname: string; lastname: string; email: string; password: string };
    beforeEach(() => {
      newUser = {
        firstname: faker.name.findName(),
        lastname: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'RandomPassword123',
      };
    });

    test('should return 201 response with user data and digits', async () => {
      const res = await request(dolph).post('/api/v1/auth/register').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.data.user.password).not.toBeNull();
      expect(res.body.user).toEqual({
        _id: expect.anything(),
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        isAccountValid: false,
        provider: 'login',
      });

      const dbUser:
        | (IUser & {
            _id: Types.ObjectId;
          })
        | null = await User.findById(res.body.user._id);
      expect(dbUser).toBeDefined();
      expect(dbUser?.password).not.toBe(newUser.password);
    });
  });
});
