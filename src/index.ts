import express from "express";
import morgan from "morgan";
import init from "./utils/primaService";
import authController from "./controllers/authController";
import userController from "./controllers/userController";
import postController from "./controllers/postController";

// init services
init()
  .then(msg => {
    console.log(msg);

    // init app
    const app = express();

    // add middlewares
    app.use(express.json());
    app.use(morgan("tiny"));

    // controllers
    app.use(authController);
    app.use(userController);
    app.use(postController);

    // basic route
    app.get("/", (req, res): void => {
      res.status(200).json({ msg: `Server is running` });
    });

    // 404 api
    app.use((req, res) => {
      res.status(404).json({ msg: "Page not found" });
    });

    app.listen(5000, () => console.log("Server started on port 5000"));
  })
  .catch(err => console.log(err));
