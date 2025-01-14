import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function POST(req, { params }) {
  const { id } = params;
  const cookies = req.headers.get('cookie');
  const upvotedCookie = cookies?.split('; ').find(c => c.startsWith(`upvoted_${id}=`));

  if (upvotedCookie) {
    return new Response(JSON.stringify({ error: "You have already upvoted this blog." }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("acmData");
    const blogsCollection = db.collection("blogs");

    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { upvotes: 1 },
      },
      { returnDocument: "after" }
    );

    const response = new Response(JSON.stringify(result.value), { status: 200 });
    response.headers.set('Set-Cookie', `upvoted_${id}=true; Path=/; HttpOnly; Max-Age=31536000`);
    return response;
  } catch (error) {
    console.error("Error updating upvotes:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
