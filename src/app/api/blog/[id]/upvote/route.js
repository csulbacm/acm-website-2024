import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function POST(req, { params }) {
  const { id } = params;
  
  // Attempt to retrieve the IP address from headers.
  // Note: depending on your hosting environment, you may need to adjust which header you use.
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  
  if (!ip) {
    return new Response(JSON.stringify({ error: "Unable to determine user identity" }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("acmData");
    const blogsCollection = db.collection("blogs");

    // Fetch the blog post
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    // Check if this IP address has already upvoted this blog.
    if (blog.upVoters && blog.upVoters.includes(ip)) {
      return new Response(JSON.stringify({ error: "You have already upvoted this blog." }), { status: 400 });
    }

    // Update the blog by incrementing the upvote count and adding the IP to the upVoters array.
    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { upvotes: 1 },
        $push: { upVoters: ip }
      },
      { returnDocument: "after" }
    );

    return new Response(JSON.stringify(result.value), { status: 200 });
  } catch (error) {
    console.error("Error updating upvotes:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
