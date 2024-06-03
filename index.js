const server = require("./server");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_CONNECTION_STRING || 'mongodb://127.0.0.1/330-Final-KyleCreek';

mongoose
  .connect("mongodb://127.0.0.1/330-Final-Creek", {})
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error(`Failed to start server:`, e);
  });