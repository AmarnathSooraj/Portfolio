
export async function POST(request: Request) {
  const body = await request.json();
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(process.env.GITHUB_API || "https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
