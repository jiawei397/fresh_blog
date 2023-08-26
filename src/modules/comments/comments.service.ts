import { Model, MongoFactory } from "deno_mongo_schema";
import { Comment } from "./comments.schema.ts";
import { format } from "timeago";
import { Marked } from "markdown";
import { CreateCommentDto } from "./comments.dto.ts";
import { BaseService } from "@/tools/utils.ts";

export class CommentsService extends BaseService {
  model: Model<Comment>;
  async init() {
    this.model = await MongoFactory.getModel(Comment);
  }

  create(params: CreateCommentDto) {
    return this.model.insertOne(params);
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  deleteByPostId(postId: string) {
    return this.model.deleteMany({
      postId,
    });
  }

  async findByPostId(postId: string): Promise<Required<Comment>[]> {
    const arr = await this.model.findMany({
      postId,
    }, {
      populates: {
        author: true,
      },
    });
    arr.forEach((comment) => {
      comment.createdAt = format(comment.createTime!, "zh_CN");
      const html = Marked.parse(comment.content);
      comment.contentHtml = html;
    });
    return arr as Required<Comment>[];
  }

  findByPostIds(postIds: string[]) {
    return this.model.findMany({
      postId: {
        $in: postIds,
      },
    });
  }

  findById(id: string) {
    return this.model.findById(id);
  }
}
