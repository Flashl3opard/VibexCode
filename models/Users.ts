// models/Users.ts
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const Users = mongoose.models.Users || mongoose.model<IUser>("Users", UserSchema);
export default Users;
