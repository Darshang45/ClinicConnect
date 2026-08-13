import http from "http";

async function checkServer() {
  return new Promise((resolve) => {
    http.get("http://localhost:5000/api/health", (res) => {
      resolve(res.statusCode === 200);
    }).on("error", () => {
      resolve(false);
    });
  });
}

checkServer().then((isUp) => {
  console.log("Server health status:", isUp ? "ONLINE" : "OFFLINE");
});
