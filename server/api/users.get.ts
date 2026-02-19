export default {
  async fetch(request: Request, env: any) {
    try {
      const result = await env.database.prepare("SELECT * FROM users").run();
      return new Response(JSON.stringify(result));
    } catch (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({
          error: true,
          message: error instanceof Error ? error.message : String(error),
          details: error
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}