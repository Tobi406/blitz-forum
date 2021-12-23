import { resolver } from "blitz";
import db from "db";

export default resolver.pipe(
  resolver.authorize(),
  async () => {
    const allGroups = db.group.findMany();
    
    return allGroups;
  },
);

