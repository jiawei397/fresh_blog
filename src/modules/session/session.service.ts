import { Session } from "./session.schema.ts";
import { CreateSession, UpdateSession } from "./session.interface.ts";
import { Model, MongoFactory } from "deno_mongo_schema";
import { BaseService } from "@/modules/tools/utils.ts";

export class SessionService extends BaseService {
  model: Model<Session>;

  async init() {
    this.model = await MongoFactory.getModel(Session);
  }

  async save(params: CreateSession): Promise<Session> {
    const session = await this.model.save(params);
    return session;
  }

  findById(id: string, isWithUserInfo: boolean) {
    return this.model.findById(id, {
      populates: isWithUserInfo
        ? {
          "user": true,
        }
        : undefined,
    });
  }

  update(params: UpdateSession) {
    return this.model.findByIdAndUpdate(params.id, params);
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  findAll(): Promise<Session[]> {
    return this.model.findMany();
  }
}
