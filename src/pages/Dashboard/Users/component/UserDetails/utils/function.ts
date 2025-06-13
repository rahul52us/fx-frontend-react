import { defaultPermissions } from "./constant";

export const transformPermissionsForForm = (permissions : any) => {

    return Object.keys(defaultPermissions).reduce((acc : any, key : string) => {
      acc[key] = { ...defaultPermissions[key], ...permissions[key] };
      return acc;
    }, {});
}

export const transformPermissionsForDB = (permissions : any) => {
    const result : any = {};
    Object.keys(permissions).forEach((moduleKey) => {
      const modulePermissions = permissions[moduleKey];
      const truePermissions = Object.keys(modulePermissions).reduce((acc : any, permKey) => {
        if (modulePermissions[permKey]) {
          acc[permKey] = true;
        }
        return acc;
      }, {});

      if (Object.keys(truePermissions).length > 0) {
        result[moduleKey] = truePermissions;
      }
    });
    return result;
  };