export default {
  async fetch(request: Request, env: any) {
    const result = await env.database.prepare("SELECT * FROM users").run();
    return new Response(JSON.stringify(result));
  }
}