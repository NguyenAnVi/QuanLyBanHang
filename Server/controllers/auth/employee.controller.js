import { writeFile } from "fs"
import {token as Token} from '../../util/token.js'
import EmployeeModel from '../../models/employee.model.js'
import Locals from '../../providers/local.js'

export const signin = async (req, res) => {
  console.log("signin");
  if (!req.body.phone || !req.body.password) {
    return res
      .status(422)
      .send({ message: 'You must provide phone and password.' })
  }
  else {
    const {phone, password} = req.body
    await EmployeeModel
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


const createNewEmployee =  (empl) => {
  return new Promise( async (resolve, reject) => {
    await EmployeeModel
      .findOne({
        $or : [
          { phone: empl.phone },
          // { email: empl.email }
        ]
      })
      .then(
        (result) => {
          if (result) {
            reject('Phone is in use')
          } else {
            const employee = new EmployeeModel({
              ...empl
            })
            employee
              .save()
              .then(savedResult => {
                resolve('Created')
              })
              .catch((err) => {
                reject("Error while register new account :"+err.message)
              })
          } // if (result) else
        } // function (result)
      ); // then
  })
}

export const signup = async function (req, res) {
  let { name, password, address, phone } = req.body
  if ( !password || !name || !phone ) {
    return res
      .status(422)
      .json({ message: 'You must provide name, phone and password.' })
      .send()
  }
  const duty = "NHANVIEN"
  await createNewEmployee({
    phone, password, duty, address, name
  })
    .then(result => {
      console.log(result);
      return res
        .status(200)
        .json({message:result})
        .send()
    })
    .catch(err=>{
      return res
        .status(500)
        .json({message:err})
        .send()
    });
  
}
export const requestCreateEmployee = async function (req, res) {
  let { name, password, duty, address, phone } = req.body
  if ( !password || !name || !phone ) {
    return res
      .status(422)
      .send({ message: 'You must provide name, phone and password.' })
  }
  if (!duty){
    return res
      .status(422)
      .send({ message: 'Duty is missing.' })
  }
  await createNewEmployee({
    phone, password, duty, address, name
  })
    .then(result => {
      console.log(result);
      return res
        .status(200)
        .json({message:result})
        .send()
    })
    .catch(err=>{
      return res
        .status(500)
        .json({message:err})
        .send()
    });
}

export const updateProfile = async (req, res) => {
  const { phone, currentpassword, newpassword, name, email } = req.body
  if (newpassword && !currentpassword) {
    return res
      .status(422)
      .send({ message: 'You must provide current password and confirm your new password.' })
  } else {
    var newData = {
      fullName:name,
      phone,
      email
    }
    await EmployeeModel
      .findByIdAndUpdate( req.user._id, newData)
      .then(
        (result) => {
          if (result) {
            const token = Token.generateToken(result)
            result.token = token
            result.save()

            if(newpassword){
              result.comparePassword(
                currentpassword,
                function(err, isMatch){
                  if(!err && isMatch===true){
                    console.log(newpassword)
                    result.password = newpassword
                    result.save()
                    return res
                      .status(200)
                      .json({
                        message:"Update profile successfully.",
                        user: {
                          ...newData,
                          accessToken:token
                        },
                    })
                  } else {
                    return res.status(422).json({
                      message: "Can not update profile due to unauthorized"
                    })
                  }
                }
              )
            } else {
              return res
                .status(200)
                .json({
                  message:"Update profile successfully.",
                  user: {
                    ...newData,
                    accessToken:token
                  },
              })
            }

            
          } else {
            return res
              .status(404)
              .json({ message: 'User not found' })
          } // if (result) else
        } // function (result)
      ) // then
      .catch(err=>{
        console.log(err)
        return res.status(500).json({
          message:err.message
        })
      })
  }
  
}
export const updateAvatar = async (req, res) => {
  setTimeout(() => {
    const __hostname = Locals.config().hostname
    const __port = Locals.config().port
    var base64Data = req.body.avatar.replace(/^data:image\/pngbase64,/, "")
    const filepath = './public/storage/avatar/'
    const filename = 'user_'+req.user._id+'.png'
    const publicpath = __hostname + ':' + __port + '/storage/avatar/'+filename
    writeFile(filepath+filename, base64Data, {
      encoding:'base64',
      flag:'w+'
    }, function(werr) {
      if(werr){
        console.log(werr)
        return res.status(500).json({
          message:werr.message,
        })
      } else {
        EmployeeModel.findByIdAndUpdate(req.user._id,{
          avatar:publicpath
        })
        .then((result)=>{
          if(result){
            return res.status(200).json({
              message:"Avatar updated!",
              avatar:publicpath
            })
          } else {
            return res.status(404).json({
              message:"User not found!"
            })
          }
        })
        .catch(err=>res.status(500).json({message:err.message}))
      }
    })
  }, 5000)
}