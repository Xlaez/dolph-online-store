import tokenTypes from '@/configs/tokenTypes';
import NAMES from '@/constants/collectionNames.model';
import { Schema, model, Document } from 'mongoose';

export interface IToken extends Document {
  token: string;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

const schema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: NAMES.USERS,
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.refresh, tokenTypes.reset_password, tokenTypes.verify_email],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Tokens = model<IToken>(NAMES.TOKENS, schema);
export default Tokens;
