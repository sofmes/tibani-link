import { Miniflare } from "miniflare";
import { drizzle } from "drizzle-orm/d1";
import { DataManager } from "../../app/lib/data-manager";

const mf = new Miniflare({
    modules: true,
    script: `export default {
        async fetch(req, env, ctx) {
            return new Response('foo');
        }
    }`,
    d1Databases: ["DB"]
});

const db = drizzle(await mf.getD1Database("DB"));
const extendedTest = test.extend({
    db,
    data: new DataManager(db)
});
export { extendedTest as test };
