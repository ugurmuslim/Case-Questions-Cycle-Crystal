import {Op} from "sequelize";
import Setting from "../models/setting.model";

export interface ISettingRepository {
    retrieveAll(searchParams: { setting_type: string }): Promise<Setting[]>;

    retrieveById(settingId: number): Promise<Setting | null>;

    getCycleSettings(): Promise<Setting[] | null>;

    bulkUpdateSettings(updates: Array<{ country: string; setting_type: string; value: string }>): Promise<void>;

    getCycleSettingsByCountry(country: string): Promise<Setting[] | null>;
}

interface SearchCondition {
    [key: string]: any;
}

class SettingRepository implements ISettingRepository {
    async retrieveAll(searchParams: { setting_type?: string }): Promise<Setting[]> {
        try {
            let condition: SearchCondition = {};

            if (searchParams?.setting_type)
                condition.setting_type = {[Op.iLike]: `%${searchParams.setting_type}%`};

            return await Setting.findAll({where: condition});
        } catch (error) {
            throw new Error("Failed to retrieve Settings!");
        }
    }

    async retrieveById(settingId: number): Promise<Setting | null> {
        try {
            return await Setting.findByPk(settingId);
        } catch (error) {
            throw new Error("Failed to retrieve Settings!");
        }
    }

    async getCycleSettings(): Promise<Setting[] | null> {
        try {
            return await Setting.findAll({
                where: {
                    setting_type: {
                        [Op.or]: ['cycle_period', 'last_publish_date', 'last_cycle_number'],
                    },
                },
            })
        } catch (error) {
            throw new Error("Failed to retrieve Settings!");
        }
    }

    async bulkUpdateSettings(updates: Array<{ country: string; setting_type: string; value: string }>): Promise<void> {
        try {
            const updatePromises = updates.map(update => {
                return Setting.update(
                    { value: update.value }, // Fields to update
                    {
                        where: {
                            country: update.country,
                            setting_type: update.setting_type
                        }
                    }
                );
            });

            // Wait for all updates to complete
            await Promise.all(updatePromises);
        } catch (error) {
            throw new Error(`Failed to update settings: ${error}`);
        }
    }

    async getCycleSettingsByCountry(country: string): Promise<Setting[] | null> {
        try {
            return await Setting.findAll({
                where: {
                    country: country,
                    setting_type: {
                        [Op.or]: ['cycle_period', 'last_publish_date', 'last_cycle_number'],
                    },
                },
            })
        } catch (error) {
            throw new Error("Failed to retrieve Settings!");
        }
    }
}

export default new SettingRepository();
