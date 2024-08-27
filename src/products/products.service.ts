import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const producto = this.productRepository.create(createProductDto);
      await this.productRepository.save(producto);
      return producto;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: Relaciones
    });
  }

  async findOne(term: string) {
    let product: Product;

    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:term});
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
            title: term.toUpperCase(),
            slug: term.toLowerCase()
          }
        ).getOne();
    }

    if(!product) throw new NotFoundException(`Product search with term: ${term} not found.`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if(updateProductDto.id && updateProductDto.id !== id)
      throw new BadRequestException('No se puede cambiar el id del producto.');

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if(!product) throw new NotFoundException(`Product with id: ${id} not found.`);

    try {
      await this.productRepository.save(product);   
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      if(!product) throw new NotFoundException(`Product with id ${id} not found.`);

      await this.productRepository.delete(id);
      return 'Product deleted successfully.'
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error.detail);
    throw new InternalServerErrorException('Error Inesperado.');
  }
}
