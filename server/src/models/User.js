import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: function () {
        return this.role !== "patient";
      },
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "receptionist", "pharmacist", "admin"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1, isActive: 1, createdAt: -1 });

// Hash password before saving
userSchema.pre("save", async function () {

  // Patients authenticate with OTP only
  if (!this.password) return;

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
