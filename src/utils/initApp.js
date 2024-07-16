import connection from "../../connectionDB/connection.js";
import * as routers from "../modules/index.routes.js";

export const initApp = (app, express) => {
  const port = 3001;

  connection();

  app.use(express.json());
  app.use("/users", routers.userRouter);
  app.use("/companies", routers.companyRouter);
  app.use("/jobs", routers.jobRouter);

  app.use("*", (req, res, next) => {
    const err = new AppError(`Invalid URL ${req.originalUrl}`, 404);
    next(err);
  });
  //====================GlobalErrorHanding=======================//
  app.use(routers.globalErrorHanding);

  app.listen(port, () => console.log(`listening on port ${port}!`));
};
