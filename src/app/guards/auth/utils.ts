import { User } from 'app/models/auth.model';
import { ROUTES } from '../../constants/route.const';
import { GuardRequireRole, Role } from '../../types/auth';

export const getDefaultRouteByRole = (user: User) => {
  switch (user.user.globalRole) {
    case Role.ADMIN:
    case Role.SUPER_ADMIN:
      return ROUTES.admin;

    case Role.USER:
      return user.company.isHaulier ? ROUTES.haulier : ROUTES.buy;
  }
};

const getUserGuardRoles = (user: User): GuardRequireRole[] => {
  const userGuardRoles = [];

  if ([Role.SUPER_ADMIN, Role.ADMIN].includes(user.user.globalRole)) {
    userGuardRoles.push(GuardRequireRole.SuperAdmin);
  }

  if (user?.company) {
    if (user.company.isHaulier) {
      userGuardRoles.push(GuardRequireRole.Haulier);
    } else {
      userGuardRoles.push(GuardRequireRole.Trading);
    }
  }

  return userGuardRoles;
};

export const checkAllowAccessAuthPage = (user: User, requireRole: GuardRequireRole[]) => {
  const userGuardRoles = getUserGuardRoles(user);

  return userGuardRoles.some((r) => requireRole.includes(r));
};
