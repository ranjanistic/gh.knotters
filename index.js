const axios = require("axios").default;

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
    const logError = (e, ctx) => {
        app.log.error("===========ERROR=============");
        app.log.error(`Error while ${ctx.name} event`);
        app.log.error(ctx.name);
        app.log.error(ctx.id);
        app.log.error(e);
        app.log.error("===========ENDERROR===========");
    };
    app.log.info("Github Knottersbot is up!");
    app.log.info("Super server: " + process.env.SUPERSERVER_HOOK);
    axios.defaults.headers.common["Authorization"] =
        process.env.INTERNAL_SHARED_SECRET;
    app.on("issues.opened", async (context) => {
        const issueComment = context.issue({
            body: "Thanks for opening this issue!",
        });
        return context.octokit.issues.createComment(issueComment);
    });

    app.on("installation", async (ctx) => {
        try {
            let done = await axios.post(process.env.SUPERSERVER_HOOK, {
                id: ctx.id,
                name: ctx.name,
                payload: ctx.payload,
            });
            if (done.status !== 200) {
                return logError("Failed to trigger", ctx);
            }
        } catch (e) {
            logError(e, ctx);
        }
    });

    app.on("installation_repositories", async (ctx) => {
        try {
            let done = await axios.post(process.env.SUPERSERVER_HOOK, {
                id: ctx.id,
                name: ctx.name,
                payload: ctx.payload,
            });
            if (done.status !== 200) {
                return logError("Failed to trigger", ctx);
            }
            let content =
                "https://img.shields.io/static/v1?label=Knotters&message=Project&color=1657ce&link=https://knotters.org&style=for-the-badge";
            ctx.payload.repositories_added
                .filter((repo) => !repo.private)
                .map(async (repo) => {
                    try {
                        const result = await ctx.octokit.repos.getContent({
                            owner: ctx.payload.installation.account.login,
                            repo: repo.name,
                            path: "README.md",
                        });
                        if (result.status === 200) {
                            content = Buffer.from(
                                `\n\n${content}\n\n${Buffer.from(
                                    result.data.content,
                                    "base64"
                                ).toString("utf8")}`
                            ).toString("base64");
                            ctx.octokit.repos.createOrUpdateFileContents({
                                owner: ctx.payload.installation.account.login,
                                repo: repo.name,
                                path: result.data.path || "README.md",
                                message: result.data.path
                                    ? "Update README.md"
                                    : "Add README.md",
                                content: content,
                                sha: result.data.sha,
                            });
                        }
                        return;
                    } catch {
                        content = Buffer.from(
                            `${repo.name}\n\n${content}\n\n`
                        ).toString("base64");
                        ctx.octokit.repos.createOrUpdateFileContents({
                            owner: ctx.payload.installation.account.login,
                            repo: repo.name,
                            path: "README.md",
                            message: "Add README.md",
                            content: content,
                        });
                    }
                });
        } catch (e) {
            logError(e, ctx);
        }
    });

    app.on("push", async (ctx) => {
        try {
            let repo = await ctx.github.repos.get({
                owner: ctx.payload.repository.owner.login,
                repo: ctx.payload.repository.name,
            });
            if (repo.data.private) {
                return;
            }
            let done = await axios.post(process.env.SUPERSERVER_HOOK, {
                id: ctx.id,
                name: ctx.name,
                payload: ctx.payload,
            });
            if (done.status !== 200) {
                logError("Failed to trigger", ctx);
            }
        } catch (e) {
            logError(e, ctx);
        }
    });

    app.on("pull_request", async (ctx) => {
        try {
            let repo = await ctx.github.repos.get({
                owner: ctx.payload.repository.owner.login,
                repo: ctx.payload.repository.name,
            });
            if (repo.data.private) {
                return;
            }
            let done = await axios.post(process.env.SUPERSERVER_HOOK, {
                id: ctx.id,
                name: ctx.name,
                payload: ctx.payload,
            });

            if (done.status !== 200) {
                logError("Failed to trigger", ctx);
            }
        } catch (e) {
            logError(e, ctx);
        }
    });
};
