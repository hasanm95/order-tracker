import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class CreateOrderDto {
    @IsOptional()
    @IsString()
    customer_name?: string;

    @IsNotEmpty()
    @IsString()
    customer_phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    items: string;

    @IsNumber()
    @IsPositive()
    amount: number;
}