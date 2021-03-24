const proxy = require("http-proxy-middleware")

module.exports = function (app) {
    app.use("/auth", proxy.createProxyMiddleware({target: "http://localhost:5000", changeOrigin: true }));
};