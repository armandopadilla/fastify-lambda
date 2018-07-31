const server = require('fastify')();
const cors = require('cors');

// Register all endpoints
// server.register(require('./modules/example'), { prefix: '/example' });

// Health
server.route({
  method: 'GET',
  url: '/health',
  handler: function (request, reply) {
    return reply.code(200).send({"message": "Yea im up little homie."})
  }
});

// Loca or lambda use.
if (require.main === module) {
  const start = async () => {
    try {
      await server.listen(3000, '::');
      server.log.debug('Listening on port 3000...');
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  start();
} else {

  exports.handler = (event, context, callback) => {

    // map lambda event
    const options = {
      method: event.httpMethod,
      url: event.path,
      payload: event.body,
      headers: event.headers,
      validate: false
    };

    server.inject(options, function(err, res) {
      const response = {
        statusCode: res.statusCode,
        body: res.payload
      };

      callback(null, response);
    });

  };

}


