import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function GET(req, { params }) {
  const { id } = params;
  const cookieHeader = req.headers.get("cookie") || "";

  // Resolve blog by ObjectId or slug
  const client = await clientPromise;
  const db = client.db("acmData");
  const col = db.collection("blogs");

  let blog = null;
  if (ObjectId.isValid(id)) {
    blog = await col.findOne({ _id: new ObjectId(id) });
  }
  if (!blog) {
    blog = await col.findOne({ slug: id });
  }
  if (!blog) {
    return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
  }

  const canonicalId = blog._id.toString();

  // Cookie check should use canonical _id so it works for slug URLs too
  const hasCookie =
    cookieHeader.includes(`upvoted_${canonicalId}=true`) ||
    cookieHeader.includes(`upvoted_${id}=true`); // legacy slug-based cookie during earlier tests

  // IP check
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    req.ip;
  const hasIp = Array.isArray(blog.upVoters) && blog.upVoters.includes(ip);

  return new Response(
    JSON.stringify({ hasUpvoted: hasCookie || hasIp }),
    { status: 200 }
  );
}
