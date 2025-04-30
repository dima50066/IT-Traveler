import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: "https://YOUR_DOMAIN/.well-known/jwks.json",
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
  }),
  audience: "YOUR_API_IDENTIFIER",
  issuer: "https://YOUR_DOMAIN/",
  algorithms: ["RS256"],
});
