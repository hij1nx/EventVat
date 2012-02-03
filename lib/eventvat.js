;(function(module, undefined) {

  var EventEmitter2, EventVat;

  if(!EventEmitter2 && require) {
    EventEmitter2 = require('eventemitter2').EventEmitter2;
    if(!EventEmitter2) {
      throw new Error('`EventEmitter2` is not defined.');
    }
  }

  function init() {
    this._events = new Object;
  }

  this.wildcard = ' ';
  this.listenerTree = new Object;

  EventVat = module.exports = function EventVat(conf) {

    if (!(this instanceof EventVat)) {
      return new EventVat(conf);
    }

    var that = this;

    that.hash = conf && conf.data || {};

    that.keys = [];

    that.killRate = 10;
    that.killer = setInterval(function() {

      var key = that.keys.shift();
      var keyExists = !!that.hash[key];

      if(keyExists && that.hash[key].dueDate <= Date.now()) {
        that.del(key);
        return true;
      }

      if(keyExists && that.hash[key].ttl && that.hash[key].ttl < 0) {
        that.del(key);
      }
      else if(keyExists && that.hash[key].ttl) {
        (that.hash[key].ttl--);
        keys.push(key);
      }

      return true;
      
    }, that.killRate);

  };

  for (var member in EventEmitter2.prototype) {
    EventVat.prototype[member] = EventEmitter2.prototype[member];
  }

  EventEmitter2.prototype.publish = EventEmitter2.prototype.emit;
  EventEmitter2.prototype.subscribe = EventEmitter2.prototype.on;

  EventVat.prototype.die = function(key) {
    clearInterval(this.killer);
  };

  // KEYS
  // ----

  //
  // Delete a key
  //
  EventVat.prototype.del = function(key) {
    if(!this.hash[key]) {
      this.emit('del ' + key);
      this.emit('del');
      return delete this.hash[key];
    }
    else {
      return false;
    }
  };

  //
  // Determine if a key exists
  //
  EventVat.prototype.exists = function(key) {
    if(this.hash[key]) {
      this.emit('exists ' + key);
      this.emit('exists');
      return true;
    }
    else {
      return false;
    }
  };

  //
  // Set a key's time to live in seconds
  //
  EventVat.prototype.expires = function(key, ttl) {

    var that = this, newVal;
    var op = ttl[0];

    ttl = +ttl.slice(1);

    if(op === '+') { 
      newVal = this.hash[key].ttl += ttl;
    }
    else {
      newVal = this.hash[key].ttl -= ttl;
    }
    
    this.keys.push(key);

    return newVal;
  };

  //
  // Set the expiration for a key as a UNIX timestamp
  //
  EventVat.prototype.expireat = function(key, dueDate) {
    if(this.hash[key]) {
      this.keys.push(key);
      return this.hash[key].dueDate = dueDate;
    }
    else {
      return false;
    }
  };

  //
  // Find all keys matching the given pattern
  //
  EventVat.prototype.keys = function(key) {

    if(this.hash[key]) {
      var keys = [];

      for(var k in this.hash) {
        if(regex.test(key)) {
          keys.push(k);
        }
      }

      return keys;
    }
    else {
      return false;
    }
  };

  //
  // Move a key to another database
  //
  EventVat.prototype.move = function(key, db) {
    if(db && db.hash) {
      db.hash[key] = this.hash[key];
      delete this.hash[key];
      return true;
    }
    return false;
  }

  //
  // Inspect the internals of EventVat objects
  //
  EventVat.prototype.object = function(subcommend /* ... */) {
    throw new Error('Not implemented.');
  };

  //
  // Remove the expiration from a key
  //
  EventVat.prototype.persist = function(key) {
    if(this.hash[key] && that.hash[key].ttl) {
      this.emit('persist ' + key);
      this.emit('persist');
      return delete this.hash[key].ttl;
    }
    else {
      return false;
    }
  };

  //
  // Return a random key from the keyspace
  //
  EventVat.prototype.randomkey = function() {
    var keys = Object.keys(this.hash);
    var index = Math.floor(Math.random()*keys.length);
    return keys[index];
  };

  //
  // Rename a key
  //
  EventVat.prototype.rename = function(oldKey, newKey) {
    if(this.hash[oldKey]) {
      this.hash[newKey] = this.hash[oldKey];
      this.emit('rename ' + oldKey, newKey);
      this.emit('rename', oldKey, newKey);
      return this.hash[key].value;
    }
    else {
      return false;
    }
  };

  //
  // Rename a key, only if the new key does not exist
  //
  EventVat.prototype.renamenx = function(oldKey, newKey) {
    if(this.hash[oldKey] && typeof this.hash[newKey] === 'undefined') {
      this.hash[newKey] = this.hash[oldKey];
      this.emit('renamenx ' + oldKey, newKey);
      this.emit('renamenx', oldKey, newKey);
      return this.hash[key].value;
    }
    else {
      return false;
    }
  };  

  //
  // Sort key by pattern
  //
  EventVat.prototype.sort = function() {
    throw new Error('Not implemented.');

    // fast javascript sort...
    
    //
    //SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
    //

  };

  //
  // Determine the type stored at key
  //
  EventVat.prototype.type = function(key) {
    return ({}).toString.call(this.hash[key]);
  };

  //
  // Get the time to live for a key
  //
  EventVat.prototype.ttl = function(key, ttl) {
    return this.hash[key].ttl;
  };

  // STRINGS
  // -------

  //
  // Append a value to a key
  //
  EventVat.prototype.append = function(key, value) {
    if(this.hash[key] && typeof this.hash[key] === 'string') {
      var newValue = this.hash[key].value + value;
      this.emit('append ' + key, value, newValue);
      this.emit('append', value, newValue);
      return newValue;
    }
    else {
      return false;
    }
  };

  //
  // Decrement the integer value of a key by one
  //
  EventVat.prototype.decr = function(key) {
    this.decrby(key, 1);
  };

  //
  // Decrement the integer value of a key by N
  //
  EventVat.prototype.decrby = function(key, value) {
    if(this.hash[key] && typeof this.hash[key].value === 'number') {
      var newValue = value ? this.hash[newKey].value -= value : this.hash[newKey].value--;
      this.emit('decr ' + key, value, newValue);
      this.emit('decr', value, newValue);
      return newValue;
    }
    else {
      return false;
    }
  };

  //
  // Get the value of a key
  //
  EventVat.prototype.get = function(key) {

    var newValue;

    if(this.hash[key]) {
      var newValue = this.hash[key].value;
      this.emit('get ' + key, key, newValue);
      this.emit('get', key, newValue);
      return newValue;
    }
    else {
      return false;
    }
  };

  //
  // Returns the bit value at offset in the string value stored at key
  //
  EventVat.prototype.getbit = function(key) {
    throw new Error('Not implemented.');
  };

  //
  // Get a substring of the string stored at a key
  //
  EventVat.prototype.getrange = function(key, start, end) {
    throw new Error('Not implemented.');
  };

  //
  // Set the string value of a key and return its old value
  //
  EventVat.prototype.getset = function(key, value) {
    var old = this.get(key);
    this.set(key, value);
    return old;
  };

  //
  // Increment the integer value of a key by one
  //
  EventVat.prototype.incr = function(key, value) {
    value = +value;
    if(this.hash[key] && typeof this.hash[key].value === 'number') {
      this.hash[newKey].value++;
      this.emit('incrby ' + key, value);
      this.emit('incrby', value);
      return newValue;
    }
    else {
      return false;
    }
  };

  //
  // Increment the integer value of a key by the given number
  //
  EventVat.prototype.incrby = function(key, value) {
    value = +value;
    if(this.hash[key] && typeof this.hash[key].value === 'number') {
      this.hash[newKey].value++;
      this.emit('incrby ' + key, value);
      this.emit('incrby', value);
      return newValue;
    }
    else {
      return false;
    }
  };

  //
  // Get the values of all the given keys
  //
  EventVat.prototype.mget = function(key /* ... */) {
    var values = [];
    for(var i=0, l=arguments.length; i < l; i++) {
      values.push(this.get(arguments[i]));
    }
    return values;
  };

  //
  // Set multiple keys to multiple values
  //
  EventVat.prototype.mset = function(key /* ... */) {
    var values = [];
    for(var i=0, l=arguments.length; i < l; i++) {
      values.push(this.set(arguments[i]));
    }
    return values;
  };

  //
  // Set multiple keys to multiple values, only if none of the keys exist
  //
  EventVat.prototype.msetnx = function(key, value /* ... */) {
    var values = [];
    for(var i=0, l=arguments.length; i < l; i++) {
      values.push(this.setnx(arguments[i]));
    }
    return values;
  };

  //
  // Set the string value of a key
  //
  EventVat.prototype.set = function(key, value, ttl) {
    var that = this;
    
    if(this.hash[key]) {
      this.hash[key].ttl = ttl;
      this.hash[key].value = value;
    }
    else {
      this.hash[key] = {
        value: value,
        ttl: ttl // time to live
      };

      this.keys.push(key);
    }

    this.emit('set ' + key, value);
    this.emit('set', key, value);
    return value;
  };

  //
  // Sets or clears the bit at offset in the string value stored at key
  //
  EventVat.prototype.setbit = function(key, offset, value) {
    throw new Error('Not implemented.');
  };

  //
  // Set the value and expiration of a key
  //
  EventVat.prototype.setex = function(key, seconds, value) {
    throw new Error('Not implemented.');
  };

  //
  // Set the value and expiration of a key
  //
  EventVat.prototype.setnx = function(key, value) {
    if(!this.hash[key]) {
      this.hash[key] = value;
      this.emit('setnx ' + key, value);
      this.emit('setnx');
      return this.hash[key].value;
    }
    else {
      return false;
    }
  };

  //
  // Get the length of the value stored in a key
  //
  EventVat.prototype.strlen = function(key) {
    if(this.hash[key]) {
      this.hash[key].length;
    }
    return false;
  };

  //
  // HASHES
  // ------
  //

  //
  // delete one or more hash fields
  //
  EventVat.prototype.hdel = function(key, field /* ... */) {
    if (!this.hash[key]) {
      if (arguments.length > 1) {
        for (var i=1, l = arguments.length; i < l; i++) {
          if(this.hash[key][arguments[i]]) {
            delete this.hash[key][arguments[i]];
          }
        }
        this.emit('hdel ' + key);
        this.emit('hdel');
        return true;
      }
    }
    else {
      return false;
    }
  };

  //
  // determine if a hash field exists
  //
  EventVat.prototype.hexists = function(key, field) {
    if(this.hash[key] && this.hash[key][field]) {
      return true;
    }
    else {
      return false;
    }
  };

  //
  // get the value of a hash field.
  //
  EventVat.prototype.hget = function(key, field) {
    if(this.hash[key] && this.hash[key][field]) {
      return this.hash[key][field];
    }
    else {
      return false;
    }
  };

  //
  // get all the fields and values in a hash
  //
  EventVat.prototype.hgetall = function(key) {
    if(this.hash[key] && this.hash[key][field]) {
      return this.hash[key];
    }
    else {
      return false;
    }
  };

  //
  // increment the integer value of a hash field by the given number
  //
  EventVat.prototype.hincrby = function(key, field, value) {
    value = +value;
    if(this.hash[key][field] && typeof this.hash[key][field].value === 'number') {
      this.hash[newKey][field].value++;
      this.emit('hincrby ' + key, value);
      this.emit('hincrby', value);
      return newValue;
    }
    else {
      return false;
    }
  };

  //
  // get all the fields in a hash
  //
  EventVat.prototype.hkeys = function(key) {
    throw new Error('Not implemented.');
  };

  //
  // get the number of fields in a hash
  //
  EventVat.prototype.hlen = function(key) {
    throw new Error('Not implemented.');
  };

  //
  // get the values of all the given hash fields
  //
  EventVat.prototype.hmget = function(key, field /* ... */) {
    throw new Error('Not implemented.');
  };

  //
  // set multiple hash fields to multiple values
  //
  EventVat.prototype.hmset = function(key, field, value /* ... */) {
    throw new Error('Not implemented.');
  };

  //
  // set the string value of a hash field
  //
  EventVat.prototype.hset = function(key, field, value) {
    throw new Error('Not implemented.');
  };

  //
  // Set the value of a hash field, only if the field does not exist
  //
  EventVat.prototype.hsetnx = function(key, field, value /* ... */) {
    throw new Error('Not implemented.');
  };

  //
  // get all the values in a hash
  //
  EventVat.prototype.hvals = function(key) {
    throw new Error('Not implemented.');
  };

  //
  //
  // Non stsandard methods.
  //
  //
  EventVat.prototype.dump = function(stringify) {
    
    var dump = {};
    
    for(var key in this.hash) {
      if(this.hash.hasOwnProperty(key)) {
        dump[key] = this.hash[key].value;
      }
    }
    
    dump = stringify ? JSON.stringify(dump) : dump;
    
    this.emit('dump', null, dump);
    return dump;
  };

  //
  // swap the values of two keys
  //
  EventVat.prototype.swap = function(a, b, depth) {
    if(this.hash[a] && this.hash[b]) {
      
      a = this.hash[a]; 
      b = this.hash[b];
      
      if(depth) {
        a = [b, b = a][0];
      }
      else {
        a.value = [b.value, b.value = a.value][0];
      }

      this.emit('swap ' + a, b, depth);
      this.emit('swap', a, b, depth);
      return depth ? [a, b] : [a.value, b.value];
    }
    else {
      return false;
    }

  };

  //
  // check if a value is in a key
  //
  EventVat.prototype.findin = function(key, value) {
    if(this.hash[key]) {
      var index = (~this.hash[key].value.indexOf(value));
      this.emit('findin ' + key, value, index);
      this.emit('findin', value, index);
      return index;
    }
    else {
      return false;
    }
  };

  //
  // set the current revision
  //

}((typeof process !== 'undefined' && process.title) ? module : window));
