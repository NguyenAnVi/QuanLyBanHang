import mongoose from "../providers/database.js"
import bcrypt from "bcrypt"

// Define the model
const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
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
    cart: { type: String, default: "[]" }
  },
  { timestamps: true, collection: "Customers" }
)

CustomerSchema.pre("save", function save(next) {
  const cus = this

  if (!cus.isModified("password")) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(cus.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError)
      }
      cus.password = hash
      next()
    })
  })
})

CustomerSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err)
      return cb(err, isMatch)
    else
      cb(null, isMatch)
  })
}

// Export the model
const CustomerModel = mongoose.model("Customers", CustomerSchema)
export default CustomerModel
