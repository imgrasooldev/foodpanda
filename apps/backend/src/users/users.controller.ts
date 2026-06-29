import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  CreateAddressDto,
  UpdateAddressDto,
  UpdateProfileDto,
} from './dto/user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('me')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.users.getProfile(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the current user profile' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(userId, dto);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'List saved delivery addresses' })
  listAddresses(@CurrentUser('id') userId: string) {
    return this.users.listAddresses(userId);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add a delivery address' })
  addAddress(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.users.addAddress(userId, dto);
  }

  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Update a delivery address' })
  updateAddress(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.users.updateAddress(userId, id, dto);
  }

  @Put('addresses/:id/default')
  @ApiOperation({ summary: 'Set an address as the default' })
  setDefault(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.users.setDefaultAddress(userId, id);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete a delivery address' })
  deleteAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.users.deleteAddress(userId, id);
  }
}
