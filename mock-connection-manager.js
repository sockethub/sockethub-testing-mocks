module.exports = function (test, session) {
  var clients = {};
  return {
    removeAll: new test.Stub(function () {

    }),
    move: new test.Stub(function(oldID, oldCreds, newID, newCreds) {
      test.write('session.connectionManager.move: renaming ' + oldID + ' to ' + newID);
      var client = clients[oldID];
      clients[newID] = client;
      delete clients[oldID];
    }),
    get: new test.Stub(function (id, createObj, cb) {
      test.write('session.connectionManager.get(' + id + ', ' + typeof createObj + ', ' + typeof cb + ')');

      session.store.get(id, function (credentials) {
        test.write('session.connectionManager.get: got credentials for ' + id);
        if (clients[id]) {
          test.write('session.connectionManager.get: returning existing client');
          cb(null, clients[id]);
        } else {
          test.write('session.connectionManager.get: creating new client');
          createObj.connect.apply({
            credentials: credentials,
            scope: session
          }, [function (err, client) {
            clients[id] = {
              credentials: credentials,
              connection: client
            };
            cb(null, clients[id]);
          }]);
        }
      });
    })
  };
};
