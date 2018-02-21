export class Event {
  constructor() {
    this.bindings = {};
  }

  on(event, handler, once = false) {
    var e = this.bindings[event];
    var h = {
      handler,
      once
    };
    var index;

    if (typeof e === 'undefined') {
      this.bindings[event] = [ h ];
    } else {
      index = this.bindings[event].findIndex(el => handler.toString() === el.handler.toString());
      if (index === -1) {
        e.push(h);
      }
    }
  }

  off(event, handler = null) {
    var index;

    if (handler === null) {
      delete this.bindings[event];
    } else {
      index = this.bindings[event].findIndex(el => handler.toString() === el.handler.toString());
      this.bindings[event].splice(index, 1);
    }
  }

  trigger(event, params) {
    var e = this.bindings[event];

    if (typeof e !== 'undefined') {
      e.forEach(el => {
        el.handler(params);
        if (el.once) {
          this.off(event, el.handler);
        }
      });
    }
  }
}