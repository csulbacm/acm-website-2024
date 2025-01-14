import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function POST(req, { params }) {
  const { id } = params;

  // Extract client IP
  const clientIp =
    req.headers.get('x-client-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-vercel-forwarded-for') ||
    req.ip ||
    'unknown';

  try {
    const client = await clientPromise;
    const db = client.db("acmData");
    const blogsCollection = db.collection("blogs");

    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    if (blog.upvoters?.includes(clientIp)) {
      return new Response(JSON.stringify({ error: "You have already upvoted this blog." }), { status: 400 });
    }

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { upvotes: 1 },
        $addToSet: { upvoters: clientIp },
      },
      { returnDocument: "after" }
    );

    return new Response(JSON.stringify(result.value), { status: 200 });
  } catch (error) {
    console.error("Error updating upvotes:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
