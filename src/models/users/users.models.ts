import { Document, model, Schema } from 'mongoose';
import validator from 'validator';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import { compare, hash } from 'bcryptjs';
import { NextFunction } from 'express';
import NAMES from 'constants/collectionNames.model';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  image: string;
  school: string;
  phoneNumber: string;
  gender: string;
  role: string;
  email: string;
  password: string;
  socials: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  isAccountValid: boolean;
  provider: string;
  createdAt: Date;
  doesPasswordMatch(password: string): Promise<boolean>;
}

const schema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    school: {
      type: String,
      enum: [],
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'both'],
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'not-say'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      //   minlength: 8,  commented beacsue of passport oauth
      validate(value) {
        if (value !== 'none') {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error('Password must contain at least one letter and one number');
          }
        }
      },
      private: true,
    },
    provider: {
      type: String,
      default: 'login',
      enum: ['login', 'google', 'facebook'],
    },
    socials: {
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
    isAccountValid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePagination);

schema.statics.isEmailTaken = async function (email: string, excludeUserId: string) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

schema.methods.doesPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this;
  return compare(password, user.password);
};

schema.pre('save', async function (next: NextFunction) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await hash(user.password, 11);
  }
  next();
});

const Users: Pagination<IUser> = model<IUser, Pagination<IUser>>(NAMES.USERS, schema);
export default Users;
