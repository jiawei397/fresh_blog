// deno-lint-ignore-file require-await
import { BaseService } from "@/modules/tools/utils.ts";
import { User } from "./user.schema.ts";
import { Model, MongoFactory } from "deno_mongo_schema";

export class UserService extends BaseService {
  userModel: Model<User>;

  async init() {
    this.userModel = await MongoFactory.getModel(User);
  }
  async getAll() {
    return this.userModel.findMany({});
  }
  async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async getUsersByIds(ids: string[]) {
    return this.userModel.findMany({
      _id: { $in: ids },
    });
  }

  async addUser(user: User) {
    const id = await this.userModel.insertOne(user);
    return id.toString();
  }

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, user: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, user);
  }

  findByName(name: string) {
    return this.userModel.findOne({ name });
  }
}
