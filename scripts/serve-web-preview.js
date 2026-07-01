const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.join(process.cwd(), "dist");
const port = Number(process.env.PORT || 8081);
const host = process.env.HOST || "127.0.0.1";

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".ttf", "font/ttf"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);

function resolveFile(url = "/") {
  const urlPath = decodeURIComponent(url.split("?")[0]);
  const requested = path.normalize(urlPath).replace(/^\.\.(?:\/|$)/, "");
  const candidate = path.join(root, requested === "/" ? "index.html" : requested);

  if (!candidate.startsWith(root)) {
    return null;
  }

  if (!fs.existsSync(candidate) || fs.statSync(candidate).isDirectory()) {
    return path.join(root, "index.html");
  }

  return candidate;
}

const server = http.createServer((request, response) => {
  const filePath = resolveFile(request.url);

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const contentType = contentTypes.get(path.extname(filePath)) || "application/octet-stream";
  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0"
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Ascension Web preview running at http://localhost:${port}`);
});
