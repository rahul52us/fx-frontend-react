import store from "../../../store/store";

export const usePermission = (moduleName: string) => {
    const canAdd = store.auth.checkPermission(moduleName, "add");
    const canEdit = store.auth.checkPermission(moduleName, "edit");
    const canDelete = store.auth.checkPermission(moduleName, "delete");
    const canView = store.auth.checkPermission(moduleName, "view");

    return { canAdd, canEdit, canDelete, canView };
};
