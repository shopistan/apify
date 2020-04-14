/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */
var AsyncPolling = require("async-polling");
module.exports.bootstrap = async function(done) {
  sails.on("lifted", function() {
    AsyncPolling(async function(end) {
      // Do whatever you want.
      let peers = await Peer.find({
        active: true
      });
      for (index in peers) {
        try {
          let peer = await Peer.findOne({
            unique: peers[index].unique
          });
          if (!peer) {
            throw { details: "No Flow Found With This ID" };
          }
          var data = await sails.helpers.trigger(peer, false);
          if (!data.length) {
            throw {
              details:
                "There is no entry coming from the API, Make sure you have atleast one entry in the application"
            };
          }
          //Action test begin here
          let response2 = await sails.helpers.action(peer, data);
          console.log(response2);
        } catch (error) {
          console.log(error);
        }
      }
      // Then notify the polling when your job is done:
      end();
      // This will schedule the next call.
    }, sails.config.custom.delay).run();
  });

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();
};
