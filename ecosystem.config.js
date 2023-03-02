module.exports = {
    apps:[{
            name: "bot.knotters.org/github",
            cwd: ".",
            script: "npm",
            args: "start",
            instances: 1,
            env: {
                NODE_ENV: "production",
            },
    }]
};
