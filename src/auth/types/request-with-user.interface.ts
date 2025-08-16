import type { Request } from 'express';

import type { User } from '../../users/schema/user.schema';

export interface RequestWithUser extends Request {
  user: User;
}
