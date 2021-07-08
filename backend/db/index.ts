import mongoose from 'mongoose';

const connectDB = async () => {
  const URI = process.env.URI!;
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log('Database connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectDB;