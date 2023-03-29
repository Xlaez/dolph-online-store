import Users from '@/models/users/users.models';
import myCustomLabels from '@/utils/labelPaginate.util';
import { AppRes, httpStatus } from '@dolphjs/core';

class UserService {
  protected model: typeof Users;

  constructor() {
    this.model = Users;
  }

  public getUserById = async (userId: string | (() => string)) => {
    return this.model.findById(userId);
  };

  public getUserByEmail = async (email: string) => {
    return this.model.findOne({ email });
  };

  public getByUniqueField = async (field: Object) => {
    return this.model.findOne(field);
  };

  public queryUsers = async (limit: number, page: number, { location, school }: { location: string; school: string }) => {
    const options = {
      lean: true,
      customLables: myCustomLabels,
    };

    const filter = {
      $and: [{ location: { $regex: location, $options: 'i' } }, { school: { $regex: school, $options: 'i' } }],
    };

    const users = await this.model.paginate(
      //@ts-expect-error
      { ...filter },
      {
        ...(limit ? { limit } : { limit: 10 }),
        page,
        sort: 'asc',
        ...options,
      }
    );
    return users;
  };

  public createUser = async (data: {}) => {
    //@ts-expect-error
    if (await this.model.isEmailTaken(data.email)) {
      throw new AppRes(httpStatus.BAD_REQUEST, 'email is taken');
    }
    const user = await this.model.create({ ...data });
    user.password = '';
    return user;
  };

  public updateUserByCustom = async (query: {}, data: {}) => {
    return this.model.updateOne(query, data);
  };
}

export default UserService;
