const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    id: { type: String },
    fullName: { type: String },
    vehicleModel: { type: String },
    color: { type: String },
    licensePlate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);