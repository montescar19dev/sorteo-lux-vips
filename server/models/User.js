import mongoose from 'mongoose';

const allowedRoles = ['user', 'admin', 'super_admin', 'staff'];
const allowedStatuses = ['active', 'suspended'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: allowedRoles,
      default: 'user',
      validate: {
        validator: function (value) {
          return allowedRoles.includes(value);
        },
        message: (props) => `${props.value} no es un rol válido.`,
      },
    },
    status: {
      type: String,
      enum: allowedStatuses,
      default: 'active',
    },
    totalPurchases: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
