import config from '@/configs';
import tokenTypes from '@/configs/tokenTypes';
import Tokens from '@/models/token.model';
import { IUser } from '@/models/users/users.models';
import { AppRes, httpStatus } from '@dolphjs/core';
import { sign, verify } from 'jsonwebtoken';
import moment from 'moment';

class TokenService {
  static generateToken = (userId: string, type: string, expires: moment.Moment = config.jwt.secret) => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return sign(payload, config.jwt.secret);
  };

  static saveToken = async (
    token: string,
    user: string,
    expires: moment.Moment | Date,
    type: string,
    blacklisted = false
  ) => {
    //@ts-expect-error
    return Tokens.findOne({ token, user, expires: expires.toDate(), type, blacklisted });
  };

  static verifyToken = async (token: string, type: string) => {
    const payload = verify(token, config.jwt.secret);
    const tokenDoc = await Tokens.findOne({ token, type, user: payload.sub, blacklisted: false });

    if (!tokenDoc) throw new AppRes(httpStatus.NOT_FOUND, 'Token not found');

    return tokenDoc;
  };

  static generateAuthTokens = async (user: IUser) => {
    const accessTokenExpires = moment().add(config.jwt.expiration, 'minutes');
    const accessToken = this.generateToken(user.id, tokenTypes.access, accessTokenExpires);

    // Update to refreshExpiration
    const refreshTokenExpires = moment().add(config.jwt.expiration, 'days');
    const refreshToken = this.generateToken(user.id, tokenTypes.refresh, refreshTokenExpires);
    await this.saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.refresh);

    return {
      acess: {
        token: accessToken,
        expires: accessTokenExpires,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires,
      },
    };
  };
}

export default TokenService;
