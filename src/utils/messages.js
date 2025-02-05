const formatMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  formatMessage,
};
