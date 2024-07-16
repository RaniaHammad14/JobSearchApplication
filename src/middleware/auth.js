import jwt from "jsonwebtoken";
import userModel from "../../connectionDB/models/user.model.js";
/**
 * Middleware function to authenticate requests based on a JWT token.
 * @returns {Function} Express middleware function.
 */
export const auth = () => {
  return async (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token) {
        return res.status(401).json({ msg: "Token not provided" });
      }

      if (!token.startsWith("viri__")) {
        return res.status(401).json({ msg: "Invalid token" });
      }
      const newToken = token.split("viri__")[1];
      if (!newToken) {
        return res.status(401).json({ msg: "Token Not Found" });
      }
      const decoded = jwt.verify(newToken, "viri");
      if (!decoded?.id) {
        return res.status(401).json({ msg: "Invalid Payload" });
      }
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ msg: "Server Error", error });
    }
  };
};
//===================================================Authorization=========================================//
/**
 * Middleware function to authorize requests based on a role.
 * @returns {Function} Express middleware function.
 */
export const authorization = (roles = []) => {
  return async (req, res, next) => {
    try {
      const { role } = req.user;
      if (!roles.includes(role)) {
        return res.status(403).json({ msg: "You Are Not Authorized" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ msg: "Server Error", error });
    }
  };
};
