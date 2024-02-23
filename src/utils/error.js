function createError(title = "", message = "") {
  const data = {
    error: {
      success: false,
      title: title,
      message: message,
    },
  };
  return data;
}

const BAD_REQUEST = "Bad request";
module.exports = {
  createError,
  BAD_REQUEST,
};
