import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Car } from './interfaces/car.interface';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: uuid(),
      brand: 'Toyota',
      model: 'Corolla',
    },
    {
      id: uuid(),
      brand: 'Honda',
      model: 'Civic',
    },
    {
      id: uuid(),
      brand: 'Jeep',
      model: 'Cherokee',
    },
  ];

  findAll() {
    return this.cars;
  }

  findOneById(id: string) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) throw new NotFoundException(`Car with id ${id} not found`);

    return car;
  }

  create(createCarDto: CreateCarDto) {
    const newCar: Car = { id: uuid(), ...createCarDto };
    this.cars.push(newCar);
    return newCar;
  }

  update(id: string, updateCarDto: UpdateCarDto) {
    if (updateCarDto.id && updateCarDto.id !== id) {
      throw new BadRequestException('Id param and body id must be equal');
    }

    let carDB = this.findOneById(id);

    this.cars = this.cars.map((car) => {
      if (car.id === carDB.id) {
        return (carDB = { ...carDB, ...updateCarDto, id });
      }
      return car;
    });

    return carDB;
  }

  delete(id: string) {
    const carDB = this.findOneById(id);

    if (carDB) {
      this.cars = this.cars.filter((car) => car.id !== id);
    }
    return;
  }
}
