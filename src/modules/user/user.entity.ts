import { IsUnique } from "src/common/validators/isUniqueConstraint";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({
        unique: true,
        nullable: false
    })
    userName: string;

    @Column({
        nullable: false
    })
    password: string;

    @Column({
        unique: true,
        nullable: false
    })
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}