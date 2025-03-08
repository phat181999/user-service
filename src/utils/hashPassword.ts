import * as bcrypt from 'bcrypt';

export class HashPassword {
    hashPassword(password: string): string {
        if(password){
            const passwordHashed = bcrypt.hashSync(password, process.env.SALT_ROUNDS || 10);
            return passwordHashed;
        }
        return '';
    }
}