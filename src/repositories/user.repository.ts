import User from "../models/users.model";

export interface IUserRepository {
  retrieveAll(searchParams: {country: string, user_date?: Date}): Promise<User[]>;
  retrieveByToken(token: string): Promise<User | null>;
}

interface SearchCondition {
  [key: string]: any;
}

class UserRepository implements IUserRepository {
  async retrieveAll(searchParams: {country?: string}): Promise<User[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.country) condition.country = searchParams.country;

      return await User.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Users!");
    }
  }

  async retrieveByToken(token: string): Promise<User | null> {
    try {
      return await User.findOne({where: {token: token}});
    } catch (error) {
      throw new Error("Failed to retrieve Users!");
    }
  }
}

export default new UserRepository();
