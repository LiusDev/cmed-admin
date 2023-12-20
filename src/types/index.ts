export enum UserRole {
    ADMIN = "admin",
    STAFF = "staff",
}

export const roleLabels: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Quản trị viên",
    [UserRole.STAFF]: "Nhân viên",
};
export interface User {
    id: number;
    username: string;
    name: string;
    role: UserRole;
}
export interface Category {
    id: number;
    createdAt: string;
    modifiedAt: string;
    name: string;
    documents: any;
    news: News[];
}

export interface News {
    id: number;
    createdAt: string;
    modifiedAt: string;
    title: string;
    description: string;
    featuredImage: string;
    content: string;
    view: number;
    category: Exclude<Category, "documents" | "news">;
}

export interface Document {
    id: number;
    createdAt: string;
    modifiedAt: string;
    name: string;
    description: string;
    documentUrl: string;
    view: number;
    category: Exclude<Category, "documents" | "news">;
}

export interface Customer {
    id: number;
    createdAt: string;
    modifiedAt: string;
    name: string;
    image: string;
}

export interface Partner {
    id: number;
    createdAt: string;
    modifiedAt: string;
    name: string;
    image: string;
}

export interface Project {
    id: number;
    createdAt: string;
    modifiedAt: string;
    name: string;
    description: string;
    content: string;
}

export interface Service {
    id: number;
    createdAt: string;
    modifiedAt: string;
    name: string;
    description: string;
    featuredImage: string;
    content: string;
}

export interface Staff {
    id: number;
    createdAt: string;
    modifiedAt: string;
    name: string;
    position: string;
    featuredImage: string;
}
