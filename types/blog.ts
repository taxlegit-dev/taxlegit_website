import { Blog, BlogGroup } from "@prisma/client";

export type BlogWithGroup = Blog & {
  blogGroup: BlogGroup;
};
