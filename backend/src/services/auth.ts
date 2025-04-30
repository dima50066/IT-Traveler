import { User } from "../db/models/User";

export const findOrCreateUser = async (
  auth0Id: string,
  email: string,
  name?: string,
  picture?: string
) => {
  let user = await User.findOne({ auth0Id });

  if (!user) {
    user = new User({ auth0Id, email, name, picture });
    await user.save();
  }

  return user;
};

export const getUserByAuth0Id = async (auth0Id: string) => {
  return User.findOne({ auth0Id });
};
