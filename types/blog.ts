import { Blog, BlogGroup, BlogAuthor } from "@prisma/client";

export type BlogWithGroup = Blog & {
  blogGroup: BlogGroup;
  author?: BlogAuthor | null;
};
