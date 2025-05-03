import { ROUTES } from '../../constants/route.const';
import { GuardRequireRole, Role, User } from '../../types/auth';

export const getDefaultRouteByRole = (user: User) => {
  switch (user.globalRole) {
    case Role.ADMIN:
    case Role.SUPER_ADMIN:
      return ROUTES.admin;

    case Role.USER:
      return user.isHaulier ? ROUTES.haulier : ROUTES.buy;
  }
};

const getUserGuardRoles = (user: User): GuardRequireRole[] => {
  const userGuardRoles = [];

  if (user.globalRole === Role.ADMIN) {
    userGuardRoles.push(GuardRequireRole.SuperAdmin);
  }

  if (user.isHaulier) {
    userGuardRoles.push(GuardRequireRole.Haulier);
  } else {
    userGuardRoles.push(GuardRequireRole.Trading);
  }

  return userGuardRoles;
};

export const checkAllowAccessAuthPage = (
  user: User,
  requireRole: GuardRequireRole[],
) => {
  const userGuardRoles = getUserGuardRoles(user);

  return userGuardRoles.some((r) => requireRole.includes(r));
};
