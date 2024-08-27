import { PartialType } from "@nestjs/mapped-types";
import { 
    IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength 
} from "class-validator";

export class CreateProductDto {
    @IsOptional()
    readonly id: string;

    @IsString()
    @MinLength(3)
    readonly title: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    readonly price?: number;
    
    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsString()
    @IsOptional()
    readonly slug: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    readonly stock?: number;

    @IsString({ each: true })
    @IsArray()
    readonly sizes: string[];

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    readonly tags: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    readonly gender: string

    //readonly image: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
