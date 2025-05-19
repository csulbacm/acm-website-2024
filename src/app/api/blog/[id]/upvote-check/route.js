import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function GET(req, { params }) {
  const { id } = params;
  // read the upvote cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const hasCookie    = cookieHeader.includes(`upvoted_${id}=true`);

  // double-check IP server-side
  const ip    = req.headers.get("x-forwarded-for")
             || req.headers.get("x-real-ip")
             || req.ip;
  const client = await clientPromise;
  const db     = client.db("acmData");
  const blog   = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
  if (!blog) {
    return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
  }

  const hasIp = Array.isArray(blog.upVoters) && blog.upVoters.includes(ip);
  const hasUpvoted = hasCookie || hasIp;

  return new Response(JSON.stringify({ hasUpvoted }), { status: 200 });
}
