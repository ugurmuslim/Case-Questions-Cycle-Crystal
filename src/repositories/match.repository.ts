import User from "../models/users.model";
import {Op} from "sequelize";
import Match from "../models/match.model";
import {th, tr} from "@faker-js/faker";

export interface IMatchRepository {
  getMatchingPeople(user_id: number, limit: number): Promise<Match[]>;
  bulkMatchingCreation(matchData: any): Promise<Match[]>;
  updateMatching(searchParams: { user_id: number; counter_user_id: number }, body: { user_match?: boolean, counter_user_match?: boolean }): Promise<void>;
}

interface SearchCondition {
  [key: string]: any;
}

class MatchRepository implements IMatchRepository {
  async updateMatching(searchParams: { user_id: number; counter_user_id: number }, body: {
    user_match?: boolean;
    counter_user_match?: boolean;
  }): Promise<void> {
    try {
      const match = await Match.findOne({ where: searchParams });
      console.log("match",match)
      if(!match) {
        throw new Error("Match not found!");
      }
      await Match.update(body, { where: searchParams });
    }   catch (error) {
      throw new Error("Failed to update the match!");
  }
  }

  async bulkMatchingCreation(matchData: any): Promise<Match[]> {
    try {
      // Use bulkCreate with ignoreDuplicates option
      return await Match.bulkCreate(matchData, { ignoreDuplicates: true });
    } catch (error) {
      throw new Error("Failed to create matches: " + error);
    }
  }
  async getMatchingPeople(user_id: number, limit: number): Promise<Match[]> {
    try {
      const matches = await Match.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { user_id: user_id },
                { counter_user_id: user_id }
              ]
            },
            {
              [Op.or]: [
                { user_match: { [Op.is]: null } },  // user_match is null
                { counter_user_match: { [Op.is]: null } }  // counter_user_match is null
              ]
            }
          ]
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'gender', 'photo_url'],
          },
          {
            model: User,
            as: 'counter_user',
            attributes: ['id', 'name', 'gender', 'photo_url'],
          }
        ],
        limit: limit,
      });

      return matches
    } catch (error) {
      throw new Error("Failed to retrieve CrystalBallQuestions!");
    }
  }



}

export default new MatchRepository();
