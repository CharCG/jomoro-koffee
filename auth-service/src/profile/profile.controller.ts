import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../common/dto/current-user.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ description: 'The user profile has been retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  @ApiNotFoundResponse({ description: 'The user profile not found' })
  @Get()
  getProfile(@CurrentUser() user: CurrentUserDto) {
    return this.profileService.getProfile(user.id);
  }
}
