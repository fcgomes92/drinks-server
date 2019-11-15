if (process.env.NODE_ENV === "development") {
  module.exports = {
    apps: [
      {
        name: "app",
        script: "npm",
        watch: false,
        interpreter: "none",
        args: "run dev"
      }
    ]
  };
} else {
  module.exports = [
    {
      name: "app",
      script: "npm",
      watch: false,
      interpreter: "none",
      args: "run start"
    }
  ];
}
