import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI = 'mongodb://localhost:27017/kanban';

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['OWNER', 'USER'] },
  },
  { timestamps: true },
);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const User = mongoose.model('User', UserSchema);

  const email = 'admin@kanban.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log(`Admin user already exists: ${email}`);
  } else {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await User.create({
      fullName: 'Admin',
      email,
      password: hashedPassword,
      role: 'OWNER',
    });

    console.log('Admin user created:');
    console.log(`  Email:    ${email}`);
    console.log(`  Password: Admin@123`);
    console.log(`  Role:     OWNER`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
