import mongoose, { Schema } from "mongoose";

const BusinessSchema = new Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessType: {
      type: String,
      required: true,
      trim: true,
    },

    GSTIN: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
    },

    timezone: {
      type: String,
      required: true,
      default: "Asia/Kolkata",
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Business", BusinessSchema);