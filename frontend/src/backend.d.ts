import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    name: string;
    sizes: Array<string>;
    category: string;
    brand: string;
    price: number;
    fitConfidence: bigint;
}
export interface backendInterface {
    getAllProducts(): Promise<Array<Product>>;
    getFilteredProducts(category: string | null, brand: string | null, sortIndex: bigint): Promise<Array<Product>>;
    getProductsByBrand(brand: string): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    initialize(): Promise<void>;
}
