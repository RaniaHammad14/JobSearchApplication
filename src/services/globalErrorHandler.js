export const globalErrorHanding = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({ msg: "Error", err: err.message });
}; 

export default globalErrorHanding