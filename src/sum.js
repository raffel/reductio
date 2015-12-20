var _ = require('lodash');

var reductio_sum = {
	add: function (a, prior, path) {
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
      if (!_.isNumber(a(v))) {
        path(p).countNaN++;
      } else {
			  path(p).sumNaN = path(p).sumNaN + a(v);
      }
      path(p).sum = (path(p).countNaN > 0) ? undefined : path(p).sumNaN;
			return p;
		};
	},
	remove: function (a, prior, path) {
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
      if (!_.isNumber(a(v))) {
        path(p).countNaN--;
      } else {
			  path(p).sumNaN = path(p).sumNaN - a(v);
      }
      path(p).sum = (path(p).countNaN > 0) ? undefined : path(p).sumNaN;
			return p;
		};
	},
	initial: function (prior, path) {
		return function (p) {
			p = prior(p);
			path(p).sum = 0;
			path(p).sumNaN = 0;
      path(p).countNaN = 0;
			return p;
		};
	}
};

module.exports = reductio_sum;
