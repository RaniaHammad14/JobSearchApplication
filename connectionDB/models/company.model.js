
import mongoose from "mongoose";


const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    address: String,
    numberOfEmployees: {
      type: String,
      required: true,
     enum: ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1000+'],
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      
    },
    company_HR: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

const companyModel = mongoose.model("company", companySchema);
export default companyModel;
