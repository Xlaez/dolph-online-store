import moment from 'moment';
import config from '../../src/configs';
import tokenTypes from '../../src/configs/tokenTypes';
import TokenService from '../../src/services/token.service';
import { userOne } from './user.fixture';

const accessTokenExpires = moment().add(config.jwt.expiration, 'minutes');
const userOneAccessToken = TokenService.generateToken(userOne._id, tokenTypes.access, accessTokenExpires);

export { accessTokenExpires, userOneAccessToken };
