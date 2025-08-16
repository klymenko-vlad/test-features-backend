import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { SchemaTypes, Types } from 'mongoose';

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  refreshToken?: string;

  @Prop({ required: true })
  @Exclude({ toPlainOnly: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
