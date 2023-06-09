import mongoose from 'mongoose';
import faker from 'faker';
import User, { IUser } from '../../src/models/users/users.models';
import { hashSync } from 'bcryptjs';

const password = 'Randompassword123';

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  firstname: faker.name.findName(),
  lastname: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password: hashSync(password, 11),
  unHashedPassword: password,
};

const userTwo = {
  _id: new mongoose.Types.ObjectId(),
  firstname: faker.name.findName(),
  lastname: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password: hashSync(password, 11),
  unHashedPassword: password,
};

const insertUsers = async (users: IUser[]) => {
  await User.insertMany(users.map((user) => ({ ...user })));
};

export { insertUsers, userOne, userTwo };
