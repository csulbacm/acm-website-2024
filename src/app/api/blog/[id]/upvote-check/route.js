export async function GET(req, { params }) {
    const { id } = params;
    const clientIp = req.headers.get("x-forwarded-for") || req.socket.remoteAddress;
  
    try {
      const client = await clientPromise;
      const db = client.db("acmData");
      const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
  
      if (!blog) {
        return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
      }
  
      const hasUpvoted = blog.upvoters?.includes(clientIp) || false;
      return new Response(JSON.stringify({ hasUpvoted }), { status: 200 });
    } catch (error) {
      console.error("Error checking upvote status:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
  