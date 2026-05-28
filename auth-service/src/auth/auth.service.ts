import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  validateRegisterInput(dto: RegisterDto) {
    for (let i = 0; i < dto.firstName.length; i++) {
      const charCode = dto.firstName.toLowerCase().charCodeAt(i);
      if (charCode < 97 || charCode > 122) {
        throw new BadRequestException('First name must be letters only (no numbers or special characters)');
      }
    }

    for (let i = 0; i < dto.lastName.length; i++) {
      const charCode = dto.lastName.toLowerCase().charCodeAt(i);
      if (charCode < 97 || charCode > 122) {
        throw new BadRequestException('Last name must be letters only (no numbers or special characters)');
      }
    }

    const emailLower = dto.email.toLowerCase();
    if (!emailLower.endsWith('.com') && !emailLower.endsWith('.net') && !emailLower.endsWith('.org') && !emailLower.endsWith('.id')) {
      throw new BadRequestException('Email must end with a valid domain (.com, .net, .org, or .id)');
    }

    if (dto.password.includes(' ')) {
      throw new BadRequestException('Password cannot contain spaces');
    }

    if (dto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    let digitCount = 0;
    for (let i = 0; i < dto.password.length; i++) {
      const charCode = dto.password.charCodeAt(i);
      if (charCode >= 48 && charCode <= 57) {
        digitCount++;
      }
    }
    if (digitCount < 2) {
      throw new BadRequestException('Password must contain at least 2 numbers');
    }
  }

  async register(dto: RegisterDto) {
    this.validateRegisterInput(dto);

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = await this.prismaService.user.create({
      data: {
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email,
        password: dto.password,
        role: 'CUSTOMER',
      },
    });

    return {
      userId: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async login(dto: LoginDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!existingUser || dto.password !== existingUser.password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const accessToken = await this.jwtService.signAsync({ sub: existingUser.id, role: existingUser.role });

    return {
      userId: existingUser.id,
      first_name: existingUser.first_name,
      last_name: existingUser.last_name,
      email: existingUser.email,
      role: existingUser.role,
      accessToken,
    };
  }
}
