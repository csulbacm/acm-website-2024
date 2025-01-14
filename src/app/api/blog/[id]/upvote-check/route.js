import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function GET(req, { params }) {
  const { id } = params;

  // Extract client IP from the 'x-forwarded-for' header
  const clientIp =
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || // Standard header
  req.headers["x-vercel-forwarded-for"] ||                // Vercel-specific
  req.socket?.remoteAddress || 
  "unknown";
console.log("Detected client IP:", clientIp);

  try {
    const client = await clientPromise;
    const db = client.db("acmData");
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    const hasUpvoted = Array.isArray(blog.upvoters) && blog.upvoters.includes(clientIp);
    return new Response(JSON.stringify({ hasUpvoted }), { status: 200 });
  } catch (error) {
    console.error("Error checking upvote status:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
