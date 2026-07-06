import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  fullName!: string;

  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({
    enum: ['OWNER', 'USER'],
  })
  role!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (this: any) {
  const user = this as any;

  if (!user.isModified('password')) return;

  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
});
