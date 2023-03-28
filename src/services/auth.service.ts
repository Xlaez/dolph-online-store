import Users from '@/models/users/users.models';

class AuthService {
  protected userModel: typeof Users;

  constructor() {
    this.userModel = Users;
  }

  public createUser = async () => {
    return 'Hello there user';
  };
}

export default AuthService;
