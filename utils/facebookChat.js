import loadScript from 'load-script';

let initialized = false;
let queue = [];

export function fb(callback) {
  if (initialized) {
    callback(window.FB);
  } else {
    queue.push(callback);
  }
}
