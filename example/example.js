// Import FS for handling read/write of config file and JSON output
const fs = require("fs");
// Import library
const nginx2json = require("../index.js");
// Read nginx config
const nginx_config = fs.readFileSync("./muffe-config.conf", "utf8");
// Define output paths
const output_path_async = "./result-async.json";
const output_path_sync = "./result-sync.json";

// Synchronous example
/*
let parsed_config = new nginx2json().parseSync(nginx_config);
parsed_config = JSON.stringify(parsed_config, null, 2)
fs.writeFileSync(output_path_sync, parsed_config);
console.log("Synchronous: File saved!")
*/

// Asynchronous example
new nginx2json().parse(nginx_config).then((config) => {
    config = JSON.stringify(config, null, 2)
    fs.writeFile(output_path_async, config, (err) => {
        if (err) throw err;
        console.log("Asynchronous: File saved!")
    })
})
