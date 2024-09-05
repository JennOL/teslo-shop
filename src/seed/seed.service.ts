import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { CreateProductDto, UpdateProductDto } from 'src/products/dto/product.dto';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService : ProductsService,
  ){}
  
  async runSeed() {
    await this.insertSeedProducts();
    return 'SEED EXECUTED';
  }

  private async insertSeedProducts(){
    this.productService.deleteAllProducts();

    const seedProducts : CreateProductDto[] = initialData.products;
    const insertPromises = [];

    seedProducts.forEach((product) => {
      insertPromises.push( this.productService.create(product) );
    });

    await Promise.all(insertPromises);

    return true;
  }

}
