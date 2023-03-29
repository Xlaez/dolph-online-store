import Users from '@/models/users/users.models';

class UserService {
  protected model: typeof Users;

  constructor() {
    this.model = Users;
  }

  public getUserById = async (userId: string | (() => string)) => {
    return this.model.findById(userId);
  };
}

export default UserService;
