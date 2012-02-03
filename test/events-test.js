
var simpleEvents = require('nodeunit').testCase;
var EventVat = require('../lib/eventvat');

module.exports = simpleEvents({

  setUp: function (test) {
    
    if (typeof test === 'function') {
      test();
    }
    else {
      test.done();
    }
  },

  tearDown: function (test) {
    if (typeof test === 'function') {
      test();
    }
    else {
      test.done();
    }
  },

  '1. Raise event on `get` method invokation for a any key': function (test) {

    var vat = new EventVat;
    var samplevalue = 10;

    vat.on('get', function(key, value) {
      test.equal(key, 'foo');
      test.equal(value, samplevalue, 'The value was captured by the event.');
      test.ok(true, 'The get event was raised');
      vat.die();
      test.done();
    });

    vat.set('foo', samplevalue);
    var val = vat.get('foo');

    test.equal(val, samplevalue, 'The value got matches the value set');
    test.expect(4);

  }, 
  '2. Raise event on `get` method invokation for a particular key': function (test) {

    var vat = EventVat();
    var samplevalue = 10;

    vat.on('get foo', function(value) {
      test.equal(value, samplevalue, 'The value was captured by the event.');
      test.ok(true, 'The get event was raised');
      vat.die();
      test.done();
    });

    var samplevalue = 10;

    vat.set('foo', samplevalue);
    var val = vat.get('foo');

    test.ok(val===samplevalue, 'The value got matches the value set');    
    test.expect(3);
    

  },  
  '3. Raise event on `set` method invokation for any key': function (test) {

    var vat = EventVat();
    var samplevalue = 10;
    
    vat.on('set', function(key, value) {
      test.equal(key, 'foo');
      test.equal(value, samplevalue);
      test.ok(true, 'The get event was raised');
      vat.die();
      test.done();
    });
    
    vat.set('foo', samplevalue);
    test.expect(3);
    

  },
  '4. Raise event on `set` method invokation for a particular key': function (test) {

    var vat = EventVat();
    vat.on('set foo', function(value) {
      test.ok(true, 'The get event was raised');
      vat.die();
      test.done();
    });
    
    var samplevalue = 10;
    
    vat.set('foo', samplevalue);
    test.expect(1);

  },
  
  '5. Raise event on `setnx` method invokation for any key': function (test) {

    var vat = EventVat();
    vat.on('setnx', function(key, value) {
      test.equal(key, 'foo');
      test.equal(value, 'bar');
      vat.die();
      test.done();
    });

    vat.setnx('foo', 'bar');
    test.expect(2);

  },

  '6. Raise event on `setnx` method invokation for a particular key': function (test) {

    var vat = EventVat();

    vat.on('setnx foo', function(value) {
      test.equal(value, 'bar');
      vat.die();
      test.done();
    });

    vat.setnx('foo', 'bar');
    test.expect(1);

  },

  '7. Raise event on `rename` method invokation for any key': function (test) {

    var vat = EventVat();

    vat.on('rename', function(oldKey, newKey) {
      test.equal(oldKey, 'a');
      test.equal(newKey, 'b');
      vat.die();
      test.done();
    });

    vat.set('a', 1);
    vat.rename('a', 'b');

    test.expect(2);

  },
  '8. Raise event on `rename` method invokation for a particular key': function (test) {

    var vat = EventVat();

    vat.on('rename a', function(newKey) {
      test.equal(newKey, 'b');
      vat.die();
      test.done();
    });

    vat.set('a', 1);
    vat.rename('a', 'b');

    test.expect(1);

  },
  '9. Raise event on `decr` method invokation for any key': function (test) {

    var vat = EventVat();

    vat.on('decr', function(key, value, newValue) {
      test.equal(key, 'foo');
      test.equal(value, 1);
      test.equal(newValue, 2);
      vat.die();
      test.done();
    });

    vat.set('foo', 3);
    vat.decr('foo');
    test.expect(3);

  },    
  '10. Raise event on `decr` method invokation for a particular key': function (test) {

    var vat = EventVat();

    vat.on('decr foo', function(value, newValue) {
      test.equal(value, 1);
      test.equal(newValue, 2);
      vat.die();
      test.done();
    });

    vat.set('foo', 3);
    vat.decr('foo');
    test.expect(2);

  },    
  '11. Raise event on `incr` method invokation for any key': function (test) {

    var vat = EventVat();

    vat.on('incr', function(key, value, newValue) {
      test.equal(key, 'foo');
      test.equal(value, 1);
      test.equal(newValue, 4);
      vat.die();
      test.done();
    });

    vat.set('foo', 3);
    vat.incr('foo');
    test.expect(3);

  },
  '12. Raise event on `incr` method invokation for a particular key': function (test) {

    var vat = EventVat();

    vat.on('incr foo', function(value, newValue) {
      test.equal(value, 1);
      test.equal(newValue, 4);
      vat.die();
      test.done();
    });

    vat.set('foo', 3);
    vat.incr('foo');
    test.expect(2);

  },
  '13. Raise event on `swap` method invokation for any key': function (test) {
    
    var vat = EventVat();

    vat.on('swap', function(a, b, depth) {
      test.equal(a, 'a');
      test.equal(b, 'b');
      test.ok(!depth);
      vat.die();
      test.done();
    });

    vat.set('a', 1);
    vat.set('b', 2);
    vat.swap('a', 'b');

    test.expect(3); 
    
  },
  '14. Raise event on `swap` method invokation for a particular key': function (test) {
    
    var vat = EventVat();

    var n = 2;
    function done() {
      if (--n === 0) {
        vat.die();
        test.done();
      }
    };

    vat.on('swap a', function(b, depth) {
      test.equal(b, 'b');
      test.ok(!depth);
      done();
    });

    vat.on('swap b', function(b, depth) {
      test.equal(b, 'a');
      test.ok(!depth);
      done();
    });

    vat.set('a', 1);
    vat.set('b', 2);
    vat.swap('a', 'b');

    test.expect(4); 
    
  },
  '15. Raise event on `findin` method invokation for any key': function (test) {
    
    var vat = EventVat();

    vat.on('findin', function(key, value, index) {
      test.equal(key, 'foo');
      test.equal(value, 'll');
      vat.die();
      test.done(); 
    });

    vat.set('foo', 'hello');
    vat.findin('foo', 'll');

    test.expect(2);
    
  },
  '15. Raise event on `findin` method invokation for a particular key': function (test) {
    
    var vat = EventVat();

    vat.on('findin foo', function(value, index) {
      test.equal(value, 'll');
      vat.die();
      test.done(); 
    });

    vat.set('foo', 'hello');
    vat.findin('foo', 'll');

    test.expect(1);
    
  },
  '16. Raise event on `del` method invokation for any key': function (test) {
    
    var vat = EventVat();

    vat.on('del', function(key) {
      test.equal(key, 'foo');
      vat.die();
      test.done();
    });

    vat.set('foo', 'hi');
    vat.del('foo');
    test.expect(1);
    
  },
  '17. Raise event on `del` method invokation for a particular key': function (test) {
    
    var vat = EventVat();

    vat.on('del foo', function() {
      vat.die();
      test.done();
    });

    vat.set('foo', 'hi');
    vat.del('foo');
    test.expect(0);
    
  },
  '18. Raise event on `exists` method invokation for any key': function (test) {
    
    var vat = EventVat();

    vat.on('exists', function(key, exists) {
      test.equal(key, 'foo');
      test.equal(exists, true);
      vat.die();
      test.done();
    });

    vat.set('foo', 234);
    vat.exists('foo');
    test.expect(2);
    
  },
  '19. Raise event on `exists` method invokation for a particular key': function (test) {
    
    var vat = EventVat();

    vat.on('exists foo', function(exists) {
      test.equal(exists, false);
      vat.die();
      test.done();
    });

    vat.exists('foo');
    test.expect(1);
    
  },
  
  '20. Raise event on `persist` method invokation for any key': function (test) {
    
    var vat = EventVat();

    vat.on('persist', function(key) {
      test.equal(key, 'foo');
      vat.die();
      test.done();
    });

    vat.set('foo', 'bar', 100);
    vat.persist('foo');
    test.expect(1);
    
  },
  '21. Raise event on `persist` method invokation for a particular key': function (test) {
    
    var vat = EventVat();

    vat.on('persist foo', function() {
      vat.die();
      test.done();
    });

    vat.set('foo', 'bar', 100);
    vat.persist('foo');
    test.expect(0);
    
  },
  '22. Raise event on `append` method invokation for any key': function (test) {
    
    var vat = EventVat();

    vat.on('append', function(key, value, newValue) {
      test.equal(key, 'foo');
      test.equal(value, 'bar');
      test.equal(newValue, 'foobar');
      vat.die();
      test.done();
    });

    vat.set('foo', 'foo');
    vat.append('foo', 'bar');
    test.expect(3);
    
  },
  '23. Raise event on `append` method invokation for a particular key': function (test) {
    
    var vat = EventVat();

    vat.on('append foo', function(value, newValue) {
      test.equal(value, 'bar');
      test.equal(newValue, 'foobar');
      vat.die();
      test.done();
    });

    vat.set('foo', 'foo');
    vat.append('foo', 'bar');
    test.expect(2);
    
  }

});