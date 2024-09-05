import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
        nullable: false
    })
    title: string;

    @Column({
        type: "float",
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @Column({
        type: 'text',
        nullable: true
    })
    gender: string;

    @BeforeInsert()
    @BeforeUpdate()
    checkSlug() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '') // replace non-alphanumeric and non-space characters
                .replace(/\s+/g, '_') // replace spaces with undeline
                .replace(/-+/g, '_') // replace doble hyphens with a single hyphen
                .replace(/^-+-$/g, '_'); // replace doble hyphens with a single hyphen
    }

}
