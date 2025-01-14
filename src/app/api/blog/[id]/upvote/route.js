import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function POST(req, { params }) {
  const { id } = params;
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0] || 
    req.socket?.remoteAddress || 
    "unknown";

  try {
    const client = await clientPromise;
    const db = client.db("acmData");
    const blogsCollection = db.collection("blogs");

    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    // Check if the user has already upvoted
    if (blog.upvoters?.includes(clientIp)) {
      return new Response(JSON.stringify({ error: "You have already upvoted this blog." }), { status: 400 });
    }

    // Update upvotes and add IP to the upvoters list
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
