import * as jwt from "jsonwebtoken";

// decode & verify token
export const decodeToken = (token: string, SECRET_KEY: string) =>
  new Promise<jwt.JwtPayload | null>(async resolve => {
    
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
  id: number
): string => {
  const options: jwt.SignOptions = {
    issuer: "rai-gaurav",
    audience: id.toString(),
    expiresIn: "1h"
  };
  return jwt.sign({ email, id }, process.env.JWT_ACCESS_KEY!, options);
};
