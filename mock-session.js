module.exports = function (test) {
  var store = {};

  var handlers = {
    send: function () {}
  }
  function callOnNext(action, cb) {
    handlers[action] = cb;
  }
  function triggerNext(action, params) {
    handlers[action].apply(undefined, params);
  }

  var session = {
    id: 'testing',
    callOnNext: callOnNext,
    send: new test.Stub(function (data) {
      console.log('SEND CALLED : ', data);
      triggerNext('send', [ data ]);
    }),
    debug: function (msg, obj) {
      if (typeof obj !== 'undefined') {
        test.write(msg, obj);
      } else {
        test.write(msg);
      }
    },
    store: {
      save: new test.Stub(function (id, data, cb) {
        store[id] = data;
        cb();
      }),
      get: new test.Stub(function (id, cb) {
        test.write('session.store.get(' + id + ')');
        cb(store[id]);
      })
    }
  };

  session.connectionManager = require('./mock-connection-manager')(test, session);
  return session;
};
