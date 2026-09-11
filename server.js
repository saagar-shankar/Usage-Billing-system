import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  // connect to database
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server started in port : ${PORT} in ${process.env.NODE_ENV}`);
    console.log(`URL: http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.log("Failed to start the server due to: ", err);
  process.exit(1);
});
