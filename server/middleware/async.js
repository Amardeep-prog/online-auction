const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.error('🔥 Async Error:', err); // <== Add this line
    next(err);
  });
};

module.exports = asyncHandler;
