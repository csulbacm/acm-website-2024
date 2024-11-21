import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function POST(req, { params }) {
  const { id } = params;
  const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    const client = await clientPromise;
    const db = client.db("acmData"); // Adjust database name
    const blogsCollection = db.collection("blogs");

    // Find the blog to ensure it exists and check if the IP has already upvoted
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    if (blog.upvoters?.includes(clientIp)) {
      return new Response(JSON.stringify({ error: "You have already upvoted this blog." }), { status: 400 });
    }

    // Increment upvotes and add the IP to the upvoters array
    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { upvotes: 1 },
        $addToSet: { upvoters: clientIp }, // Add IP to the upvoters array
      },
      { returnDocument: "after" }
    );

    return new Response(JSON.stringify(result.value), { status: 200 });
  } catch (error) {
    console.error("Error updating upvotes:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
