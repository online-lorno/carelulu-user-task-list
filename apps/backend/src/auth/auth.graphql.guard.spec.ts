import { JwtService } from '@nestjs/jwt';

import { AuthGraphqlGuard } from './auth.graphql.guard';

describe('AuthGraphqlGuard', () => {
  it('should be defined', () => {
    expect(new AuthGraphqlGuard(new JwtService())).toBeDefined();
  });
});
