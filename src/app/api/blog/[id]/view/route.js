import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function POST(req, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("acmData"); // Adjust the database name
    const blogsCollection = db.collection("blogs");

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }, // Increment views by 1
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
