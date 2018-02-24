import bodymovin from 'lottie-web';
import isNumber from 'lodash/isnumber';
import isString from 'lodash/isstring';
import isBoolean from 'lodash/isboolean';
import defaultTo from 'lodash/defaultto';
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
    this._anims = [];
    this._el = document.querySelector(options.container);
    this._index = 0;

    this._el.classList.add('player')

    // Prepare scenes
    options.scenes.forEach((s, i) => {
      var div = document.createElement('div');

      div.classList.add('scene', `scene-${i}`, `scene-${s.id}`);
      this._el.appendChild(div);
      s.renderer = this.options.renderer || 'svg';
      s.prerender = !!this.options.prerender;
      s.container = div;
      s.autoplay = false;
      s.index = i;
      this._anims[i] = bodymovin.loadAnimation(s);
    });

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

    if (isString(index)) {
      scene = this._getSceneFromId(index);
    } else {
      index = isNumber(index) ? index : 0;

      if (index === 0) {
        this.trigger('start');
        this._el.classList.add('animation-started');
        this._el.classList.remove('animation-ended');
      }

      scene = this.scenes[index];
    }

    if (!scene) {
      this.trigger('finish');
      this._el.classList.remove('animation-started');
      this._el.classList.add('animation-ended');
      return;
    }

    this._index = scene.index;

    anim = this._anims[scene.index];
    speed = defaultTo(scene.speed, 1);
    reverse = defaultTo(scene.reverse, false);

    if (this.actualScene) {
      this.actualScene.container.classList.remove('active');
    }

    scene.container.classList.add('active');
    this.actualScene = scene;
    this.trigger('scene', scene);
    anim.setSpeed(speed);
    if (reverse) {
      anim.goToAndStop(anim.totalFrames, true);
      anim.setDirection(-1);
    } else {
      anim.goToAndStop(0, true);
      anim.setDirection(1);
    }
    anim.play();

    if (!scene.loop) {
      anim.addEventListener('complete', () => this._triggerSceneFinish(scene));
    } else if (isNumber(scene.loop)) {
      this.counter = 0;
      anim.addEventListener('loopComplete', () => {
        this.counter++;
        if (this.counter >= scene.loop) { this._triggerSceneFinish(scene) }
      })
    } else if (isNumber(scene.duration)) {
      this.timer = setTimeout(() => this._triggerSceneFinish(scene), scene.duration * 1000);
    }
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

  _triggerSceneFinish(scene) {
    // scene.container.classList.remove('active');
    // this.anims[index].stop();
    this.play(scene.index + 1);
    this.trigger('sceneFinish', scene);
  }

  _getSceneFromId(id) {
    console.log('id =>', id);
    return find(this.scenes, { id });
  }
}


export default Player;