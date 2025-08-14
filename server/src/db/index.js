import mongoose from "mongoose";

const connectDB = async () => {
  console.log(process.env.MONGO_URL);

  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/ai`
    );
    console.log(
      `Connected to database: ${connectionInstance.connection.host} `
    );
  } catch (error) {
    console.log("MONGODB connection error: " + error);
    process.exit(1);
  }
};

export default connectDB;
