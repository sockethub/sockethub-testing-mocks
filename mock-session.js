module.exports = function (test) {
  var store = {};

  var session = {
    id: 'testing',
    send: new test.Stub(function () {

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

  session.client = require('./mock-connection-manager')(test, session);
  return session;
};
