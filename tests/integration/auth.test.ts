import setupTestDB from '../utils/setupTestDB';
import faker from 'faker';
import request from 'supertest';
import dolph from '../../src/servers';
import { httpStatus } from '@dolphjs/core';
import User, { IUser } from '../../src/models/users/users.models';
import { Types } from 'mongoose';
import { insertUsers, userOne, userTwo } from '../fixtures/user.fixture';

// setupTestDB();

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

      expect(res.body.user.password).toBeUndefined();
      expect(res.body.user).toEqual({
        id: expect.anything(),
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        isAccountValid: false,
        provider: 'login',
      });
      expect(res.body.digits).toBeDefined();
      const dbUser:
        | (IUser & {
            _id: Types.ObjectId;
          })
        | null = await User.findById(res.body.user._id);
      expect(dbUser).toBeDefined();
      expect(dbUser?.password).not.toBe(newUser.password);
    });

    test('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalidEmail';
      await request(dolph).post('/api/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'pass';
      await request(dolph).post('/api/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'password';
      await request(dolph).post('/api/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
      newUser.password = '11111111111';
      await request(dolph).post('/api/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /api/v1/login', () => {
    test('should return 200 status code and login user if email and password match', async () => {
      //@ts-ignore
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: userOne.unHashedPassword,
      };

      const res = await request(dolph).post('/api/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);
      expect(res.body.data.user).toEqual({
        id: expect.anything(),
        firstname: userOne.firstname,
        lastname: userOne.lastname,
        email: userOne.email,
        isAccountValid: false,
        provider: 'login',
      });

      expect(res.body.data.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('should return 401 error if there are no users with the email', async () => {
      const loginCredentials = {
        email: userTwo.email,
        password: userTwo.unHashedPassword,
      };

      const res = await request(dolph).post('/api/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'incorrect email or password' });
    });

    test('should return 401 error if password is wrong', async () => {
      //@ts-ignore
      await insertUsers([userTwo]);
      const loginCredentials = {
        email: userTwo.email,
        password: 'wrongPassword1',
      };

      const res = await request(dolph).post('/api/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);
      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'incorrect email or password' });
    });
  });

  describe('POST /api/v1/auth/verify-account', () => {
    let newUser: { firstname: string; lastname: string; email: string; password: string };
    beforeEach(() => {
      newUser = {
        firstname: faker.name.findName(),
        lastname: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'RandomPassword123',
      };
    });
    test('should return 200 status code', async () => {
      const res = await request(dolph).post('/api/v1/auth/register').send(newUser).expect(httpStatus.CREATED);
      expect(res.body.digits).toBeDefined();
      const digits = res.body.digits.toString();
      const res2 = await request(dolph).post('/api/v1/auth/verify-account').send({ digits }).expect(httpStatus.OK);
      expect(res2.body).toEqual({ msg: 'success' });
    });

    test('should return 400 status code when digits is wrong', async () => {
      const res = await request(dolph).post('/api/v1/auth/verify-account').send({ digits: '121212' });
      expect(res.body).toEqual({ code: httpStatus.NOT_FOUND, message: 'request for verification code again' });
    });
  });
});
