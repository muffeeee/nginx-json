
Array.prototype.clean = function() {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == '' || this[i] == undefined) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

class nginx2json {
    constructor() {
        this.conf = new Object;
        this.object_paths = [];
        this.current_object = {};
        this.parent_objects = []
    }
    parseSync(d) {
        return this.parseString(d);
    }
    async parse(d) {
        return this.parseString(d);
    }
    parseString(string) {
        let lines = string.split("\n");
        for (let i=0; i<lines.length; i++) {
            this.parseLinev2(lines[i])
        }
        return this.conf
    }
    parseLinev2(line) {
        this.splitLine(line);
    }
    splitLine(line) {
        line = line.replace(/\s+/g, " ").trim().split(/(;|{|})(?=([^\"]*\"[^\"]*\")*[^\"]*$)/g);
        this.clean(line);
    }
    clean(data) {
        data = data.clean();
        this.skipComments(data);
    }
    skipComments(data) {
        if (data.length != 0 && data[0].charAt(0) != "#") {
            this.checkType(data);
        }
    }
    checkType(data) {
        let line_ending = data[data.length-1]
        if (line_ending == ";") {
            this.parseOptions(data);
        }
        else if (line_ending == "{") {
            this.parseObjectStart(data);
        }
        else if (line_ending == "}") {
            this.parseObjectEnd(data);
        }
        else {
            throw new Error("Invalid line ending")
        }
    }
    parseOptions(data) {
        let options = data[0].trim().split(/ (.+)/).clean()
        this.addOptions(options[0], options[1])
    }
    addOptions(directive, values) {
        if (this.current_object[directive] == undefined) {
            this.current_object[directive] = values;
        }
        else if (Array.isArray(this.current_object[directive])) {
            this.current_object[directive].push(values);
        }
        else if (typeof this.current_object[directive] === "string") {
            this.current_object[directive] = [ this.current_object[directive], values ]
        }
        else {
            throw new Error("Directive already exists, but is formatted incorrectly")
        }
    }
    parseObjectStart(data) {
        let object_params = data[0].trim().split(/ (.+)/).clean()
        this.addObject(object_params[0], object_params[1])
    }
    addObject(name, args) {
        this.object_paths.push(name);
        if (this.current_object != {}) {
            this.parent_objects.push(this.current_object);
            this.current_object = {}
        }
        this.current_object._OBJECT_ARGS = args;
    }
    parseObjectEnd(data) {
        let object_result = this.current_object;
        let object_args = object_result._OBJECT_ARGS;
        delete object_result._OBJECT_ARGS;
        let current_object_name = this.object_paths.pop();
        this.current_object = this.parent_objects.pop();
        if (typeof this.current_object[current_object_name] === "undefined") {
            this.current_object[current_object_name] = {
                args: object_args,
                data: object_result
            }
        }
        else if (!Array.isArray(this.current_object[current_object_name]) && typeof this.current_object[current_object_name] === "object") {
            this.current_object[current_object_name] = [this.current_object[current_object_name], {
                args: object_args,
                data: object_result
            }]
        }
        else if (Array.isArray(this.current_object[current_object_name])) {
            this.current_object[current_object_name].push({
                args: object_args,
                data: object_result
            })
        } 
        else {
            throw new Error("Object already exists in parent, but its malformed")
        }
        this.checkIfFinished()
    }
    checkIfFinished() {
        if (this.object_paths.length == 0) {
            this.conf = this.current_object;
        }
    }
}

module.exports= nginx2json;