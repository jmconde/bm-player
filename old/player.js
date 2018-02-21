function Player (options) {
  var _this = this;

  this.options = options;
  this.scenes = options.scenes;
  this.anims = [];
  this.el = document.querySelector(options.container);
  this.index = 0;

  options.scenes.forEach(function (s, i) {
      var div = document.createElement('div');

      div.classList.add('scene', 'scene-' + i);
      _this.el.appendChild(div);
      s.renderer = _this.options.renderer || 'svg';
      s.prerender = !!_this.options.prerender;
      s.container = div;
      s.autoplay = false;
      _this.anims[i] = bodymovin.loadAnimation(s)
  });

  if (options.autoplay) {
      this.play(this.index);
  }
}

Player.prototype.play = function (index) {
  var _this = this;
  var scene, div, anim, speed, reverse;

  index = index || 0;

  if (index === 0) {
      this.options.onStart && this.options.onStart();
  }

  this.index = index;
  scene = this.scenes[index];

  if (!scene) {
      this.options.onFinish && this.options.onFinish();
      return;
  }
  console.log('Playing ', scene.path);
  div = this.el.querySelector('.scene-' + index);
  anim = this.anims[index];
  speed = typeof scene.speed === 'undefined' ? '1' : scene.speed;
  reverse = typeof scene.reverse === 'undefined' ? false : scene.reverse;
  console.log(speed, reverse);

  if (this.actualScene) {
      this.actualScene.container.classList.remove('active');
  }

  scene.container.classList.add('active');
  this.actualScene = scene;
  this.options.onScene && this.options.onScene(scene);
  anim.setSpeed(speed);
  if (reverse) {
      anim.goToAndStop(anim.totalFrames, true);
      anim.setDirection(reverse ? -1 : 1);
  }
  anim.play();
  if (!scene.loop) {
      anim.addEventListener('complete', function () {
          _this.play(index + 1);
      });
  }
}

Player.prototype.next = function () {
  this.play(this.index + 1)
}
