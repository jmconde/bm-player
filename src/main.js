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
    console.log('scene', scene);

    this._index = scene.index;

    anim = scene.animation;
    speed = defaultTo(scene.speed, 1);
    reverse = defaultTo(scene.reverse, false);

    if (this.actualScene) {
      this.actualScene.container.classList.remove('active');
      this.actualScene.animation.stop();
    }

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

  next() {
    var scene = this.scenes[this._index];

    if (!scene) {
      this.trigger('finish');
      return;
    }

    if (scene.loop && !isNumber(scene.loop)) {
      this.trigger('sceneFinish', scene);
    }

    this.play(this._index + 1);
  }

  _setFinishScenario(scene) {
    if (isBoolean(scene.loop) && !scene.loop) {
      console.log('scenario 1');
      this._setEventListener(scene, 'complete', this._sceneFinishListener);
    } else if (isNumber(scene.iterations)) {
      console.log('scenario 2');
      this.counter = 0;
      this._setEventListener(scene, 'loopComplete', this._loopIterationsListener);
    } else if (isNumber(scene.duration)) {
      console.log('scenario 3');
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
    scene.listeners.forEach(fn => fn.call());
    this.trigger('sceneFinish', scene);
    scene.playing = false;
    // scene.animation.stop();

    if (this._hasMoreScenes(scene)) {
      scene.container.classList.remove('active');
      this.play(scene.index + 1);
    } else if (!this.options.loop) {
      this.trigger('finish');
      this._el.classList.remove('animation-playing');
      this._el.classList.add('animation-ended');
    } else {
      this.play(0);
    }
    // if (!this.options.loop) {
    //   this.trigger('finish');
    //   this._el.classList.remove('animation-playing');
    //   this._el.classList.add('animation-ended');
    //   return;
    // } else {
    //   scene = this.scenes[0];
    // }
  }

  _getSceneFromId(id) {
    console.log('id =>', id);
    return find(this.scenes, { id });
  }
}


export default Player;