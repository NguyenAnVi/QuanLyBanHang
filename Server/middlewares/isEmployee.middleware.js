export const isEmployee = (req, res, next) => {
  if (!req.userType === 'EMPLOYEE'){
    return res
      .status(403)
      .send({
        message: 'Forbidden!'
      });
  }
  next();
}