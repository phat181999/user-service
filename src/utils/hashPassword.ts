import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export class HashPassword {
    private configService: ConfigService;
    constructor()  {
        this.configService = new ConfigService();
    }
    async hashPassword(password: string): Promise<string> {
        try{
            if(password){
                const saltRounds = this.configService.get<number>('SALT_ROUNDS') || 10;
                const passwordHashed = await bcrypt.hashSync(password, saltRounds || 10);
                return passwordHashed;
            }
            return '';
        }catch(err){
            return `Error: ${err.message}`;
        }
    }
}