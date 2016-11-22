
var handler = {
  subscribe: function (model, message) {
    console.log('on event subscribe');
    console.log(model, message);
  },
  unsubscribe: function (model, message) {
    console.log('on event unsubscribe');
    console.log(model, message);
  },
  scan: function (model, message) {
    console.log('on event scan');
    console.log(model, message);
  },
  location: function (model, message) {
    console.log('on event location');
    console.log(model, message);
  },
  click: function (model, message) {
    console.log('on event click');
    console.log(model, message);
  },
  view: function (model, message) {
    console.log('on event view');
    console.log(model, message);
  },
  templatesendjobfinish: function (model, message) {
    console.log('on event templatesendjobfinish');
    console.log(model, message);
  }
};

module.exports = handler;
