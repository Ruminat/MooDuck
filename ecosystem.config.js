module.exports = {
  apps: [
    {
      name: "mooduck-bot",
      script: "./dist/mooduck.js",
      instances: 1,
      watch: false,
    },
  ],
};
