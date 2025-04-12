import { UserRole } from "../../../shared/interface";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
    
    @ApiProperty({ description: 'The unique identifier for the user' })
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @ApiProperty({ description: 'The username of the user', uniqueItems: true })
    @Column({
        nullable: false,
        unique: true
    })
    userName: string;

    @ApiProperty({ description: 'The password of the user' })
    @Column({
        nullable: true
    })
    password: string;

    @ApiProperty({ description: 'The email of the user', uniqueItems: true })
    @Column({
        unique: true,
        nullable: false
    })
    email: string;

    @ApiProperty({ description: 'The image of the user' })
    @Column({
        nullable: true
    })
    image: string;

    @ApiProperty({ description: 'The role of the user', enum: UserRole, default: UserRole.USER })
    @Column({
        nullable: false,
        default: UserRole.USER
    })
    role: string;

    @ApiProperty({ description: 'The date the user was created' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'The date the user was last updated' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'The date the user was deleted' })
    @DeleteDateColumn()
    deletedAt: Date;
}