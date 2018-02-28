# nginx-json
A parser that converts nginx configs into a json file that my "json-nginx" can understand

Do NOT use this in a production enviroment.
It has a bunch of bugs that currently renders it useless for large, somewhat-complicated nginx config files.
Some of these bugs are:
- some add_header parameters cause the script to go into an existencial crisis, creating a huge nested array
- the above issue also causes the script to just skip 90% of the code
- please don't use this

## Usage
`node main.js`
