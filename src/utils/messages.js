const formatMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  formatMessage,
};
