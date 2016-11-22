var handler = {
  text: function (model, message) {
    console.log('on message text');
    console.log(model, message);
  },
  image: function (model, message) {
    console.log('on message image');
    console.log(model, message);
  },
  voice: function (model, message) {
    console.log('on message voice');
    console.log(model, message);
  },
  video: function (model, message) {
    console.log('on message video');
    console.log(model, message);
  },
  shortvideo: function (model, message) {
    console.log('on message shortvideo');
    console.log(model, message);
  },
  location: function (model, message) {
    console.log('on message location');
    console.log(model, message);
  },
  link: function (model, message) {
    console.log('on message link');
    console.log(model, message);
  }
};

module.exports = handler;
