# BODYMOVIN PLAYER v0.1.0

This project allows to chain After Effects lottie-web (bodymovin) plugin animations like a movie's storyboard.


## Install module

```
npm i bm-player --save
```

## Demo

See index.html in ```dist/demo``` directory.

## Documentation

```
import BMPlayer from 'bm-player';
-or-
var BMPlayer = require('bm-player');
-or-
window.BMPlayer
```

```
new BMPlayer(<options>);
```


### Player Options
```javascript
/**
@param {Array}    scenes    required
@param {String}   container      required
@param {Boolean|Number}  autoplay   default: false if number set it is a delay in seconds
@param {Boolean|Number}  loop
@param {Player}   chain
**/
```

### Scene Options

```javascript
/**
@param {String}   id        required
@param {String}   path      required
@param {Boolean|Number}  loop
@param {Number}   duration
@param {Boolean}  reverse
@param {Number}   speed
**/
```
### Public Methods

* play(```undefined``` | index | id)
* stop()
* pause()
* next()

### Events
* start
* complete
* scene
* sceneComplete
* loopComplete


## Contributing

```javascript
git clone git@github.com:jmconde/bm-player.git

npm i -g rollup

npm i -g browser-sync

npm install
```

Make your changes and create a pull request! =)