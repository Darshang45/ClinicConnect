import jwt from "jsonwebtoken";

export const verifyRegistrationToken = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Registration token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.purpose !== "patient-registration" ||
      !decoded.verified
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid registration token.",
      });
    }

    req.registration = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Registration session expired.",
    });

  }
};