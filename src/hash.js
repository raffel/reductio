var _ = require('lodash');

var reductio_hash = {
  add: function (a, prior, path) {
    return function (p, v, nf) {
      if(prior) prior(p, v, nf);

      if (path(p).hash[a(v)]) {
        // already in hash, increase occurrence counter
        path(p).hash[a(v)]++;
      }
      else {
        path(p).hash[a(v)] = 1;
        if (a(v) > path(p).max || _.isUndefined(path(p).max)) {
          path(p).max = a(v);
        }
        if (a(v) < path(p).min || _.isUndefined(path(p).min)) {
          path(p).min = a(v);
        }
      }

      return p;
    };
  },
  remove: function (a, prior, path) {
    return function (p, v, nf) {
      if(prior) prior(p, v, nf);

      if (!path(p).hash[a(v)]) {
        // value not in hash, something is wrong
        console.error('HASH corrupted');
        return p;
      }

      if (path(p).hash[a(v)] == 1) {
        // last occurrence, delete value from hash
        delete path(p).hash[a(v)];
        if (a(v) == path(p).max) {
          // max value was removed, need to recalculate max
          path(p).max = _.max(_.map(_.keys(path(p).hash), function(v) {
            return +v;
          }));
        }
        if (a(v) == path(p).min) {
          // min value was removed, need to recalculate min
          path(p).min = _.min(_.map(_.keys(path(p).hash), function(v) {
            return +v;
          }));
        }
      }
      else {
        // just decrement occurrence counter
        path(p).hash[a(v)]--;
      }

      return p;
    };
  },
  initial: function (prior, path) {
    return function (p) {
      p = prior(p);
      path(p).max = undefined;
      path(p).min = undefined;
      path(p).hash = {};
      return p;
    };
  }
};

module.exports = reductio_hash;
