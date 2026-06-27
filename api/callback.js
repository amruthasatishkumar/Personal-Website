const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

function renderResult(status, content) {
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Authorizing…</title></head>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:${status}:${JSON.stringify(content)}',
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
    <p>Completing sign-in…</p>
  </body>
</html>`;
}

export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  const { code, state } = req.query;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const cookie = req.headers.cookie || "";
  const match = cookie.match(/oauth_state=([^;]+)/);
  const savedState = match ? match[1] : null;

  if (!clientId || !clientSecret) {
    res
      .status(500)
      .send(renderResult("error", { message: "OAuth env vars are not configured." }));
    return;
  }

  if (!code || !state || state !== savedState) {
    res
      .status(400)
      .send(renderResult("error", { message: "Invalid OAuth state or missing code." }));
    return;
  }

  try {
    const tokenRes = await fetch(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      res
        .status(401)
        .send(
          renderResult("error", {
            message: data.error_description || "Could not obtain access token.",
          })
        );
      return;
    }

    res
      .status(200)
      .send(renderResult("success", { token: data.access_token, provider: "github" }));
  } catch (err) {
    res.status(500).send(renderResult("error", { message: String(err) }));
  }
}
