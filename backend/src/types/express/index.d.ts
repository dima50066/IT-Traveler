import { AuthenticatedUser } from "./types";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedUser;
      file?: MulterFile;
    }
  }
}
