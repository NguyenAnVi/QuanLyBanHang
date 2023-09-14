import { token } from '../util/token.js'
import CustomerModel from '../models/customer.model.js';
import EmployeeModel from '../models/employee.model.js';

export const loginRequired = async (req, res, next) => {
  if (!req.header('Authorization'))
    return res
      .status(401)
      .send({
        message: 'Unauthorize!' // no author header
      });
  // Validate jwt
  const tryToken = req.header('Authorization').split(' ')[0];
  token.verifyToken(tryToken, async (err, payload) => {
    if (err) return res.status(401).send({
      status: false,
      message: err
    });
    await CustomerModel.findById(payload.sub)
      .then(async (result) => {
        if (result) {
          req.user = result;
          req.user.password = undefined;
          req.userType = "CUSTOMER";
          return next();
        } else {
          await EmployeeModel.findById(payload.sub)
            .then((result) => {
              if (result) {
                req.user = result;
                req.user.password = undefined;
                req.userType = "EMPLOYEE";
                return next();
              } else {
                return res.status(403).send({
                  status: false,
                  message: 'Middleware error: User not found!!!'
                });
              }
            })
        }
      });
  })
}