export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export interface CreateUser {
    userName: string;
    image: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export interface CreateUserGithub {
    userName: string;
    image: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export interface CreateUserGoogle {
    userName: string;
    image: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export interface GetUser {
    userId: any;
    userName: string;
    image: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export interface UpdateUser {
    userName: string;
    image: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export interface User {
    userId: string;   
    userName: string; 
    email: string;     
    password?: string; 
    role: string;      
    image?: string;  
    createdAt: Date;    
    updatedAt: Date;     
}
  