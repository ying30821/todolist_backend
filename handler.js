const successHandler = (res, headers, data) => {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      data: data,
    })
  );
  res.end();
};
const errorHandler = (res, headers, errorCode, message) => {
  res.writeHead(errorCode, headers);
  res.write(
    JSON.stringify({
      status: 'failed',
      message,
    })
  );
  res.end();
};

module.exports = { successHandler, errorHandler };
