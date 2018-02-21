import bodymovin from 'lottie-web';

import {Event} from './event';

/* eslint-disable */
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
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
class Player extends Event {
  constructor(options) {
    super();
    var delay;
    this.options = options;
    this.scenes = options.scenes;
    this.anims = [];
    this.el = document.querySelector(options.container);
    this.index = 0;

    options.scenes.forEach((s, i) => {
      var div = document.createElement('div');

      div.classList.add('scene', 'scene-' + i);
      this.el.appendChild(div);
      s.renderer = this.options.renderer || 'svg';
      s.prerender = !!this.options.prerender;
      s.container = div;
      s.autoplay = false;
      this.anims[i] = bodymovin.loadAnimation(s);
    });

    if (typeof options.autoplay === 'boolean' && options.autoplay) {
      this.play(this.index);
    } else if (typeof options.autoplay === 'number' || typeof options.autoplay === 'string') {
      delay = Number(options.autoplay);
      setTimeout(() => this.play(this.index), delay * 1000);
    }
  }

  play(index) {
    var scene, anim, speed, reverse;

    index = index || 0;

    if (index === 0) {
      this.trigger('start');
      this.options.onStart && this.options.onStart();
    }

    this.index = index;
    scene = this.scenes[index];

    if (!scene) {
      this.trigger('finish');
      this.options.onFinish && this.options.onFinish();
      return;
    }

    anim = this.anims[index];
    speed = typeof scene.speed === 'undefined' ? '1' : scene.speed;
    reverse = typeof scene.reverse === 'undefined' ? false : scene.reverse;

    if (this.actualScene) {
      this.actualScene.container.classList.remove('active');
    }

    scene.container.classList.add('active');
    this.actualScene = scene;
    this.options.onScene && this.options.onScene(scene);
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
      anim.addEventListener('complete', () => this.play(index + 1));
      this.trigger('sceneFinish', scene);
      this.options.onFinishScene && this.options.onFinishScene(scene);
    }
  }
  next() {
    var scene = this.scenes[this.index];

    if (!scene) {
      this.options.onFinish && this.options.onFinish();
      this.trigger('finish');
      return;
    }

    if (scene.loop) {
      this.trigger('sceneFinish', scene);
      this.options.onFinishScene && this.options.onFinishScene(scene);
    }

    this.play(this.index + 1);
  }
}


export default Player;