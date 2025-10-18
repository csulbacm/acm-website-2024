import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";
import { rateLimit } from "../../../../../../lib/rateLimit";

const limiter = rateLimit({ windowMs: 10_000, max: 3 });

export async function POST(req, { params }) {
  const { id } = params;

  try {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const client = await clientPromise;
    const db = client.db("acmData"); // Adjust the database name
    const blogsCollection = db.collection("blogs");

    // Resolve by ObjectId or slug
    let blog = null;
    if (ObjectId.isValid(id)) {
      blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    }
    if (!blog) {
      blog = await blogsCollection.findOne({ slug: id });
    }
    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    const canonicalId = blog._id.toString();
    const { allowed, reset } = limiter(`view:${canonicalId}:${ip}`);
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now())/1000)) } });
    }

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(canonicalId) },
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(result.value), { status: 200 });
  } catch (error) {
    console.error("Error updating views:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
