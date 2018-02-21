import bodymovin from './bodymovin';

export class Player {
  constructor(options) {
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

    if (options.autoplay) {
      this.play(this.index);
    }
  }

  play(index) {
    var scene, anim, speed, reverse;

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
      anim.setDirection(-1);
    } else {
      anim.goToAndStop(0, true);
      anim.setDirection(1);
    }
    // anim.play();
    if (!scene.loop) {
      anim.addEventListener('complete', () => this.play(index + 1));
    }
  }

  next() {
    this.play(this.index + 1);
  }
}
