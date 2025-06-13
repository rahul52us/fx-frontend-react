export const  generateResponse =(data :  any[]) => {
    return data.map(user => {
        const designation = user.designation && user.designation.length > 0
            ? user.designation[0].title
            : "No designation";

        const department = user.departmentCategory && user.departmentCategory.length > 0
            ? user.departmentCategory[0].title
            : "No department";

        return {
            ...user,
            name: user.name || "No name",
            designation: designation,
            department: department,
            bloodGroup:user?.profileDetails?.bloodGroup
        };
    });
}