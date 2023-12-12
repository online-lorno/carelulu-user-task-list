import { JwtService } from '@nestjs/jwt';

import { AuthRestGuard } from './auth.rest.guard';

describe('AuthRestGuard', () => {
  it('should be defined', () => {
    expect(new AuthRestGuard(new JwtService())).toBeDefined(); // Pass an instance of JwtService as an argument
  });
});
