import bodymovin from 'lottie-web';
import isNumber from 'lodash/isnumber';
import isString from 'lodash/isstring';
import isBoolean from 'lodash/isboolean';
import defaultTo from 'lodash/defaultto';
import isUndefined from 'lodash/isundefined';
import find from 'lodash/find';
import { Event } from './event';

/* eslint-disable */
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}
/* eslint-enable */

/**
 * A player to run lottie-web animations.
 *
 * @class Player
 * @extends {Event}
 */
class Player extends Event {
  /**
   * Creates an instance of Player.
   * @param {Object} options Options. see README.md
   * @memberof Player
   */
  constructor(options) {
    var delay;

    super();
    this.options = options;
    this.scenes = options.scenes;
    this._el = document.querySelector(options.container);
    if (isNumber(this.options.loop)) {
      this.animationCount = 0;
    }
    this._index = 0;

    this._el.classList.add('player');

    this._prepareScenes();

    if (isBoolean(options.autoplay) && options.autoplay) {
      this.play(this._index);
    } else if (isNumber(options.autoplay)) { //
      delay = Number(options.autoplay);
      setTimeout(() => this.play(this._index), delay * 1000);
    }
  }

  /**
   * Plays a specific animation
   *
   * @param {String|Number} index Scene index or id.
   * @returns {undefined}
   * @memberof Player
   */
  play(index) {
    var scene, anim, speed, reverse;


    if (this.timer) { clearTimeout(this.timer); }

    scene = this._getScene(index);

    if (isUndefined(scene)) {
      throw new Error(`Scene '${index}' undefined.`);
    }

    this._index = scene.index;

    anim = scene.animation;
    speed = defaultTo(scene.speed, 1);
    reverse = defaultTo(scene.reverse, false);

    if (this.actualScene) {
      this.actualScene.container.classList.remove('active');
      this.actualScene.animation.stop();

      if (this.paused || this.playing) {
        this._cleanSceneListeners(this.actualScene);
      }
    }

    this.paused = false;
    this.stopped = false;
    this.playing = true;

    scene.container.classList.add('active');
    this.actualScene = scene;

    anim.setSpeed(speed);
    if (reverse) {
      anim.goToAndStop(anim.totalFrames, true);
      anim.setDirection(-1);
    } else {
      anim.goToAndStop(0, true);
      anim.setDirection(1);
    }

    this._setFinishScenario(scene);

    this.trigger('scene', scene);
    scene.playing = true;
    anim.play();
  }

  stop () {
    if (!this.stopped && this.actualScene) {
      if (this.timer) { clearTimeout(this.timer); }
      this.stopped = true;
      this._cleanSceneListeners(this.actualScene);
      this.actualScene.container.classList.remove('active');
      this.actualScene.animation.stop();
      this._index = 0;
      this.scenes[0].container.classList.add('active');
    }
  }

  pause () {
    if (!this.paused) {
      this.actualScene.animation.pause();
      this.paused = true;
    } else {
      this.actualScene.animation.play();
      this.paused = false;
    }
  }

  next() {
    var scene = this.actualScene;

    if (scene.loop && !isNumber(scene.loop)) {
      this.trigger('sceneComplete', scene);
    }

    this.play(this._index + 1);
  }

  _cleanSceneListeners(scene) {
    scene.listeners.forEach(fn => fn.call());
  }
  _setFinishScenario(scene) {
    if (isBoolean(scene.loop) && !scene.loop) {
      this._setEventListener(scene, 'complete', this._sceneFinishListener);
    } else if (isNumber(scene.iterations)) {
      this.counter = 0;
      this._setEventListener(scene, 'loopComplete', this._loopIterationsListener);
    } else if (isNumber(scene.duration)) {
      this.timer = setTimeout(() => this._sceneFinish(scene), scene.duration * 1000);
    } else {
      this._setEventListener(scene, 'loopComplete', this._loopIterationsListener);
    }
  }

  _loopIterationsListener () {
    var scene = this.actualScene;

    this.counter++;
    this.trigger('loopComplete');
    if (!isUndefined(scene.iterations)) {
      if (this.counter >= scene.iterations) { this._sceneFinish(scene); }
    }
  }
  _sceneFinishListener() {
    this._sceneFinish(this.actualScene);
  }

  _hasMoreScenes(scene) {
    return !isUndefined(this.scenes[scene.index + 1]);
  }

  _getScene(index) {
    if (isString(index)) {
      return this._getSceneFromId(index);
    } else {
      index = isNumber(index) ? index : 0;

      if (index === 0) {
        this.trigger('start');
        this._el.classList.add('animation-playing');
        this._el.classList.remove('animation-ended');
      }

      return  this.scenes[index];
    }
  }

  _setEventListener(scene, evnt, fn) {
    scene.listeners.push(scene.animation.addEventListener(evnt, fn.bind(this)));
  }

  _prepareScenes() {
    // Prepare scenes
    this.options.scenes.forEach((s, i) => {
      var div = document.createElement('div');

      div.classList.add('scene', `scene-${i}`, `scene-${s.id}`);
      this._el.appendChild(div);
      s.renderer = this.options.renderer || 'svg';
      s.prerender = !!this.options.prerender;
      s.container = div;
      s.autoplay = false;
      s.index = i;
      s.player = this;
      s.listeners = [];
      if (isNumber(s.loop)) {
        s.iterations = s.loop;
        s.loop = true;
      }

      s.animation = bodymovin.loadAnimation(s);
    });
  }

  _sceneFinish(scene) {
    this._cleanSceneListeners(scene);
    this.trigger('sceneComplete', scene);
    scene.listeners = [];
    scene.playing = false;
    // scene.animation.stop();

    if (this._hasMoreScenes(scene)) {
      scene.container.classList.remove('active');
      this.play(scene.index + 1);
    } else if (isUndefined(this.options.loop) || (isBoolean(this.options.loop) && !this.options.loop)) {
      this._complete();
      if (this.options.chain instanceof Player) {
        this.options.chain.play();
      }
    } else {
      if (isNumber(this.animationCount)) {
        if (this.animationCount === (this.options.loop - 1)) {
          this._complete();
          if (this.options.chain instanceof Player) {
            this.options.chain.play();
          }
          return;
        }
        this.animationCount++;
      }

      this.play(0);
    }
  }

  _complete() {
    this.trigger('complete');
    this.playing = false;
    this._el.classList.remove('animation-playing');
    this._el.classList.add('animation-ended');
  }

  _getSceneFromId(id) {
    console.log('id =>', id);
    return find(this.scenes, { id });
  }
}


export default Player;