import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";
import { rateLimit } from "../../../../../../lib/rateLimit";

const limiter = rateLimit({ windowMs: 60_000, max: 5 });

export async function POST(req, { params }) {
  const { id } = params;
  // get client IP
  const ip = req.headers.get("x-forwarded-for")
          || req.headers.get("x-real-ip")
          || req.ip;

  const client = await clientPromise;
  const db     = client.db("acmData");
  const col    = db.collection("blogs");

  // Resolve by ObjectId or slug
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
  const { allowed, reset } = limiter(`upvote:${canonicalId}:${ip}`);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too Many Requests" }), { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now())/1000)) } });
  }

  // enforce IP block
  if (Array.isArray(blog.upVoters) && blog.upVoters.includes(ip)) {
    return new Response(
      JSON.stringify({ error: "Already upvoted" }),
      { status: 400 }
    );
  }

  // increment upvotes + record IP
  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(canonicalId) },
    {
      $inc:  { upvotes: 1 },
      $push: { upVoters: ip }
    },
    { returnDocument: "after" }
  );

  // 5) set a long-lived cookie so this browser is flagged
  const res = new Response(JSON.stringify(result.value), { status: 200 });
  res.headers.append(
    "Set-Cookie",
    `upvoted_${canonicalId}=true; Path=/; Max-Age=31536000; SameSite=Lax`
  );
  return res;
}
