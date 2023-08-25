const mongoose = require("mongoose");

const ConnectToDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://blogtesting72:YR6ucXR73MtXc9pP@cluster0.jzntgys.mongodb.net/blogtest?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "blogData-test",
      }
    )
    .then(() => {
      console.log("Database Connection is ready...");
    })
    .catch((err) => {
      console.log("err", err);
    });
};

module.exports = { ConnectToDB };
