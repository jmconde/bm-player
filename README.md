# ANIMATION PLAYER v0.0.1

## Installing

```javascript
git clone ssh://git@globaldevtools.bbva.com:7999/~josemanuel.conde.campo/animation-player.git

npm i -g rollup

npm i -g browser-sync

npm install
```

## Running
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