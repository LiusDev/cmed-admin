export enum UserRole {
    ADMIN = "admin",
    STAFF = "staff",
}

export const roleLabels: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Quản trị viên",
    [UserRole.STAFF]: "Nhân viên",
}

export interface Banner {
    id: number
    name: string
    image: string
}
export interface User {
    id: number
    username: string
    name: string
    role: UserRole
}
export interface Category {
    id: number
    createdAt: string
    modifiedAt: string
    name: string
    documents: any
    news: News[]
}

export interface News {
    id: number
    createdAt: string
    modifiedAt: string
    title: string
    description: string
    featuredImage: string
    content: string
    view: number
    category: Exclude<Category, "documents" | "news">
}

export interface Document {
    id: number
    createdAt: string
    modifiedAt: string
    name: string
    description: string
    featuredImage: string
    document: string
    view: number
    category: Exclude<Category, "documents" | "news">
}

export interface Customer {
    id: number
    createdAt: string
    modifiedAt: string
    name: string
    description: string
    image: string
    logo: string
    icon: string
}

export interface Partner {
    id: number
    createdAt: string
    modifiedAt: string
    name: string
    image: string
}

export interface Project {
    id: number
    createdAt: string
    modifiedAt: string
    name: string
    featuredImage: string
    description: string
    content: string
    images: ProjectImage[]
}

export interface ProjectImage {
    id: number
    createdAt: string
    modifiedAt: string
    image: string
}

export interface Service {
    id: number
    createdAt: string
    modifiedAt: string
    name: string
    description: string
    featuredImage: string
    featuredImage2: string
    content: string
}

export interface Staff {
    id: number
    createdAt: string
    modifiedAt: string
    name: string
    position: string
    description: string
    featuredImage: string
}

export interface Metadata {
    id: number
    companyName: string
    companyPhone: string
    companyEmail: string
    companyAddress: string
    ceoImage: string
    quoteImage: string
}

export interface Contact {
    id: number
    createdAt: string
    modifiedAt: string
    name: string
    email: string
    phone: string
    company: string
    customerType: string
    content: string
}

export interface Recruitment {
    id: number
    createdAt: string
    modifiedAt: string
    title: string
    deadline: string
    content: string
}

export interface AboutSlide {
    id: number
    title: string
    description: string
    image: string
}
