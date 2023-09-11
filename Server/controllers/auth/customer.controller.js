import { writeFile } from "fs";
import {token as Token} from '../../util/token.js';
import CustomerModel from '../../models/customer.model.js';
import Locals from '../../providers/local.js';

export const signin = async (req, res) => {
  if (!req.body.phone || !req.body.password) {
    return res
      .status(422)
      .send({ message: 'You must provide phone and password.' })
  }
  else {
    const {phone, password} = req.body
    await CustomerModel
      .findOne({
        phone
      })
      .then(result => {
        if (result) {
          result.comparePassword( 
            password, 
            (err, isMatch) => {
              if (err || !isMatch) {
                return res.status(401).json({ 
                  message: "Wrong password or phone number" })
              }
              const token = Token.generateToken(result)
              result.token = token
              result.save()
              .then((r)=>{
                r.password = undefined
                return res.json({
                  ...r._doc,
                  accessToken:token
                })
              })
            }
          )
        } else {
          return res.status(401).json({
            message:"unauthorized"
          }).send()
        }
      })
  }
}

export const signup = async function (req, res) {
  let { name, password, phone } = req.body
  if ( !password || !name || !phone ) {
    return res
      .status(422)
      .json({ message: 'You must provide name, phone and password.' })
      .send()
  }
  await CustomerModel
    .findOne({
      $or : [
        { phone },
      ]
    })
    .then(
      (result) => {
        if (result) {
          return res.status(404).sent({message: 'Phone is in use'})
        } else {
          const customer = new CustomerModel({
            ...req.body
          })
          customer
            .save()
            .then(savedResult => {
              return res.status(200).send({message: 'Created'})
            })
            .catch((err) => {
              return res.status(500).send({message:"Error while register new account :"+err.message})
            })
        } // if (result) else
      } // function (result)
    ); // then
  
}
export const updateProfile = async (req, res) => {
  const { phone, currentpassword, newpassword, name, address } = req.body;
  if (newpassword && !currentpassword) {
    return res
      .status(422)
      .send({ message: 'You must provide current password and confirm your new password.' });
  } else {
    var newData = {
      name,
      phone,
      address
    }
    await CustomerModel
      .findByIdAndUpdate( req.user._id, newData)
      .then(
        (result) => {
          if (result) {
            const token = Token.generateToken(result);
            result.token = token;
            result.save();

            if(newpassword){
              result.comparePassword(
                currentpassword,
                function(err, isMatch){
                  if(!err && isMatch===true){
                    result.password = newpassword;
                    result.save();
                    return res
                      .status(200)
                      .json({
                        message:"Update profile successfully.",
                        user: {
                          ...newData,
                          accessToken:token
                        },
                    });
                  } else {
                    return res.status(422).json({
                      message: "Can not update profile due to unauthorized"
                    });
                  }
                }
              );
            } else {
              return res
                .status(200)
                .json({
                  message:"Update profile successfully.",
                  user: {
                    ...newData,
                    accessToken:token
                  },
              });
            }

            
          } else {
            return res
              .status(404)
              .json({ message: 'User not found' });
          } // if (result) else
        } // function (result)
      ) // then
      .catch(err=>{
        console.log(err);
        return res.status(500).json({
          message:err.message
        })
      })
  }
  
}
export const updateAvatar = async (req, res) => {
  setTimeout(() => {
    const __hostname = Locals.config().hostname;
    const __port = Locals.config().port;
    var base64Data = req.body.avatar.replace(/^data:image\/png;base64,/, "");
    const filepath = './public/storage/avatar/';
    const filename = 'customer_'+req.user._id+'.png';
    const publicpath = __hostname + ':' + __port + '/storage/avatar/'+filename;
    writeFile(filepath+filename, base64Data, {
      encoding:'base64',
      flag:'w+'
    }, function(werr) {
      if(werr){
        console.log(werr);
        return res.status(500).json({
          message:werr.message,
        });
      } else {
        CustomerModel.findByIdAndUpdate(req.user._id,{
          avatar:publicpath
        })
        .then((result)=>{
          if(result){
            return res.status(200).json({
              message:"Avatar updated!",
              avatar:publicpath
            });
          } else {
            return res.status(404).json({
              message:"User not found!"
            });
          }
        })
        .catch(err=>res.status(500).json({message:err.message}));
      }
    });
  }, 5000);
}