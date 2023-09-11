import mongoose from "../providers/database.js"
import bcrypt from "bcrypt"
import {AvailableEmployeeDuties} from '../config/shop.config.js'

// Define the model
const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    duty:{
      type: String,
      validate: {
        validator(v) {
          return AvailableEmployeeDuties.includes(v)
        },
        message: (props) =>
          `${props.value} is not a valid Duty, Check Server/config/shop!`,
      },
    },
    address:{
      type: String
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator(v) {
          return /^[0-9]{10}$/.test(v)
        },
        message: (props) =>
          `${props.value} is not a valid phone number!`,
      },
    },
    avatar: { type: String },
  },
  { timestamps: true, collection: "Employees" }
)

EmployeeSchema.pre("save", function save(next) {
  const emp = this

  if (!emp.isModified("password")) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(emp.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError)
      }
      emp.password = hash
      next()
    })
  })
})

EmployeeSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) 
      return cb(err, isMatch)
    else
      cb(null, isMatch)
  })
}

// Export the model
const EmployeeModel = mongoose.model("Employees", EmployeeSchema)
export default EmployeeModel
