module.exports = {
  username: {
    type: 'string',
    minLenght: 4,
    required: true
  },
  email: {
    type: 'email',
    required: true
  },
  password: {
    type: 'string',
    minLenght: 6,
    required: true
  },
  confirm: {
    matches: 'password'
  }
};
