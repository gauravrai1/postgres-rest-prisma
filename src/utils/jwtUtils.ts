import * as jwt from "jsonwebtoken";

// decode & verify token
export const decodeToken = (token: string) =>
  new Promise<jwt.JwtPayload | null>(async resolve => {
    const SECRET_KEY  = process.env.SECRET_KEY;
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) {
        resolve(null);
        return;
      } else {
        resolve(payload as jwt.JwtPayload);
        return;
      }
    });
  });

// generate access token
export const generateAccessToken = (
  email: string,
  name: string,
  id: string
): string => {
  const options: jwt.SignOptions = {
    issuer: "rai-gaurav",
    audience: id,
    expiresIn: "1h"
  };
  return jwt.sign({ email, name, id }, process.env.JWT_ACCESS_KEY!, options);
};
