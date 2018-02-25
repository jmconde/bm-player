# BODYMOVIN PLAYER v0.1.0

## Installing project

```javascript
git clone git@github.com:jmconde/bm-player.git

npm i -g rollup

npm i -g browser-sync

npm install
```

## Running demo
```
npm start
```

## Documentation

### Player
autoplay: 0.5,
        scenes: scenes,
        container: '#bodymovin'
```javascript
/**
@param {Array}    scenes    required
@param {String}   container      required
@param {Boolean|Number}  autoplay   default: false if number set it is a delay in seconds
@param {Boolean|Number}  loop
@param {Player}   chain
**/
```

### Scenes

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

### Events
* start
* finish
* scene
* sceneFinish