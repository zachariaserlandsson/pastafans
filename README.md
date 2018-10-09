# pastafans
Repository for a code kata.

# Onboarding
The static files need to be served with an HTTP server. I achieved this with the node module http-server, obtainable through npm. To install the required resources, clone the repository and 'cd' into the directory. Then just type the following (obviously requires node):
```
$ npm install 
```
Then, to run the http-server allowing CORS (cross-origin resource sharing), enter
```
$ http-server -c-1 --cors
```
Then just load the index.html in your browser!
