import { model, models, ObjectId, Schema } from "mongoose";

export interface IAccount {
  userId: ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: "User", requierd: true },
  name: { type: String, required: true },
  image: { type: String },
  password: { type: String },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
});

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;
