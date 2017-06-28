var readline = require('readline');
rl = readline.createInterface({
  input: require('fs').createReadStream("test.txt")
})
Array.prototype.clean = function() {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == '') {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
var conf = new Object;
var paths = [];

rl.on('line', function(line) {
  // take whatever input, clean it and split into something we can manage
  // split on characters ";", "{" and "}"
  input = line.replace(/\s+/g, " ").trim().split(/(;|{|})/g);
  for (i=0; i<input.length; i++) {
    if (input[i+1] == ";") {
      input = input[i].trim().split(/ (.+)/).clean()
      // we kinda have to keep track of what our current "path" is, e.g.
      // what nginx-block we're inside
      if (paths != []) {
        path = conf;
        for (v=0; v<paths.length; v++) {
          path = path[paths[v]].data
        }
      }
      // we're determining if the directive already exists
      // in the JSON object. JSON doesn't support multiple keys with
      // the same name, so we're just putting the directives values into
      // an array
      if (path[input[0]]) {
      // if there already is an existing array, then just use that
        if (path[input[0]] === Array) {
          conf[input[0]].push(input[1])
        }
        else {
          data = new Array;
          data.push(path[input[0]]);
          data.push(input[1]);
          path[input[0]] = data;
        }
      }
      // if the directive doesn't already exist in the object, then we don't need any arrays
      else {
        path[input[0]] = input[1]
      }
    }
    // Oh hey, a block!
    else if (input[i+1] == "{") {
      // make sure that we still know what path this is in
      if (paths != []) {
        path = conf;
        for (v=0; v<paths.length; v++) {
          path = path[paths[v]].data;
        }
      }
      // clean up the data and split it on the first space (splitting directive and args)
      block = input[i].trim().split(/ (.+)/).clean()
      for (g=0; g<block.length; g++) {
        block[g] = block[g].trim();
      }
      // if the block has any arguments, add them
      if (block[1]) {
        path[block[0]] = {
          args: block[1].trim(),
          data: new Object
        }
      }
      // if not, don't bother
      else {
        path[block[0]] = {
          data: new Object
        }
      }
      paths.push(block[0])
    }
    // if this is the end of a block, remove it from the path
    else if (input[i+1] == "}") {
      paths.pop();
    }
  }
}
)
// file is done, log finished object
rl.on('close', function() {
        console.log(JSON.stringify(conf, null, 2))
})
