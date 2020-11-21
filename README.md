# nginx-json
A parser that converts nginx configs into a json file that "json-nginx" can understand.

It's currently out in pre-beta testing. Feel free to test it yourself and give feedback, but expect it to break. I'd be very happy if you could try out nginx-json and json-nginx with some heavy and obscure configs to test out their stability!

# Known limitations
Currently, this parser does not support multiple server/upstream blocks in a single file.

# Usage
See "example" folder.

# Related
[json-nginx](https://github.com/muffeeee/json-nginx)