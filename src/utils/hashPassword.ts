import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export class HashPassword {
    private readonly configService: ConfigService;
    private readonly logger: Logger;

    constructor() {
        this.configService = new ConfigService();
        this.logger = new Logger(HashPassword.name);
    }

    async hashPassword(password: string): Promise<string> {
        if (!password) {
            this.logger.error('Password is required');
            throw new Error('Password is required');
        }

        try {
            const saltRounds = this.configService.get<number>('SALT_ROUNDS') ?? 10;
            const passwordHashed = await bcrypt.hash(password, saltRounds);
            return passwordHashed;
        } catch (err) {
            this.logger.error(`Error hashing password: ${err.message}`);
            throw new Error(`Error hashing password: ${err.message}`);
            
        }
    }
}
