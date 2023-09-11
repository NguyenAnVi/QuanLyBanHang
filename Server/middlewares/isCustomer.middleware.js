export const isCustomer = (req, res, next) => {
  if (!req.userType === 'CUSTOMER'){
    return res
      .status(403)
      .send({
        message: 'Forbidden!'
      });
  }
  next();
}