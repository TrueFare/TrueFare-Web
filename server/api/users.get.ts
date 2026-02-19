export default {
  async fetch(request: Request, env: any) {
    const result = await env.database.prepare("SELECT * FROM users").all();
    return new Response(JSON.stringify(result.results), {
      headers: { "Content-Type": "application/json" },
    });
  }
}