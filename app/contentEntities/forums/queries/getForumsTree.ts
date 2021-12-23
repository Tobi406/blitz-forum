import asyncMap from "app/util/asyncMap";
import { resolver } from "blitz";
import db from "db";

const getForums = async (forumId?: number | null) => {
  console.log(forumId);
  let forums = await db.forum.findMany({
    where: {
      forumId: forumId || null,
    },
  });
  forums = await asyncMap(forums, async (forum) => ({
    ...forum,
    forums: await getForums(forum.id),
  }));
  return forums;
};

export default resolver.pipe(async (forumId?: number | null) => {
  return await getForums(forumId || null);
});

