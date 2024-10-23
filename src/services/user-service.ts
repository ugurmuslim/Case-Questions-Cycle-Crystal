import {IUserRepository} from "../repositories/user.repository";
import User from "../models/users.model";

export class UserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async getUserByToken(token: string): Promise<User> {
        const user =  await this.userRepository.retrieveByToken(token)

        if(user === null) {
            throw new Error("User not found!")
        }

        return user
    }
}