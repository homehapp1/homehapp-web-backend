import Alt from 'alt';
// import { snapshot } from 'alt/lib/utils/StateFunctions';
//import chromeDebug from 'alt/utils/chromeDebug';
const alt = new Alt({
  serialize: function(data) {
    // Custom serializer that eliminates circular references
    let cache = [];
    let val = JSON.stringify(data, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }

        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    // Send cache to garbage collector
    cache = [];
    return val;
  }
});

// if (process.env.DEBUG) {
//   chromeDebug(alt);
// }

module.exports = alt;
