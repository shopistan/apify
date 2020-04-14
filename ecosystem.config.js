module.exports = {
  apps: [
    {
      name: "apify-platform",
      script: "./app.js",
      env: {
        NODE_ENV: "production",
        PORT: "3010"
      }
    }
  ]
};
