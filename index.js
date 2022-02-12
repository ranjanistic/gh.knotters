const axios = require("axios").default;

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.log.info("Yay, the app was loaded!");
  app.log.info(process.env.INTERNAL_SHARED_SECRET);
  app.log.info(process.env.SUPERSERVER_HOOK);

  axios.defaults.headers.common["Authorization"] = process.env.INTERNAL_SHARED_SECRET;
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("installation", async(ctx)=>{
    try{
      let done = await axios.post(process.env.SUPERSERVER_HOOK, {
        id:ctx.id,
        name:ctx.name,
        payload:ctx.payload
      })
      done.status === 200 ? app.log.info("Successfull event triggerd "+ctx.name) : app.log.error("Failed to trigger "+ctx.name)
      app.log.info(done.data.data)
    } catch(e) {
      console.log(ctx.name, ctx.id)
      console.log("Error while installing event", e)
    }
  })
  app.on("installation_repositories", async(ctx)=>{
    try{
      let done = await axios.post(process.env.SUPERSERVER_HOOK, {
        id:ctx.id,
        name:ctx.name,
        payload:ctx.payload
      })
      done.status === 200 ? app.log.info("Successfull event triggerd "+ctx.name) : app.log.error("Failed to trigger "+ctx.name)
      app.log.info(done.data.data)
    } catch(e) {
      console.log(ctx.name, ctx.id)
      console.log("Error while installing event", e)
    }
  })
  app.on("push", async (context) => {
    // send payload to webhook
    const payload = context.payload;
    const webhook = process.env.WEBHOOK_URL;
    const options = {
      method: "POST",
      uri: webhook,
      body: payload,
      json: true,
    };
    const response = await request(options);
    console.log(response);

    context.payload
  });
};
