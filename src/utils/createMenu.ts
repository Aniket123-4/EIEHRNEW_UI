import { fetchMenuData } from "@/services/apiRequest/api";
import { getPackageId, getUserInLocalStorage, setMenu } from "./common";



const getModulePath = (name: string) => {
    const { verifiedUser, selectedPackageId }: any = getUserInLocalStorage();

    switch (name) {

        case "Appoint Doctor":
            return "/booking/doctor-slot-booking";

        case "Disease Master":
            return "/complaints/addDisease";

        case "Complaint Master":
            return "/complaints/addComplaint";

        case "Investigation Parameter":
            return "/investigation/AddInvParameter";

        case "InfraStructure":
            return "/investigation/addInvGroup";

        case "Patient Registration":
            return "/complaints/AddOnlineLogin";

        case "Search Patient":
            return "/complaints/Patient";

        case "Direct Item Receipt":
            return "/complaints/AddInvUnit";

        case "Item Status":
            return "/complaints/AddPatRequest";
       
        case "Manage Appointment":
            return "/complaints/ManageAppointment";

        case "User Management":
            return "/user-management/list";

        case "Change Password":
            return "/UserManagement/change-password";

        case "Role Form Permission":
            return "/userrole";

        case "Candidate Display":
            return "/candidate/list";



        default:
            if (verifiedUser.userTypeID === "11") {
                return "/candidate-dashboard";
            } else {
                return "/";
            }

    }
}

export const createMenu = async () => {

    const { verifiedUser, selectedPackageId }: any = getUserInLocalStorage();

    const param: any = {
        userID: verifiedUser?.userID,
        orgID: verifiedUser?.orgID,
        roleID: -1,
        packageID: getPackageId(),
        userTypeID: verifiedUser?.userTypeID,
        portalTypeID: -1,
        ipAddres: "",
        type: 1
    }
    const menuData = await fetchMenuData(param);
    const { moduleRight, formRight } = menuData.data;
    const menu: any = [];


    for (let i = 0; i < moduleRight.length; i++) {

        menu.push({
            name: moduleRight[i]['mModuleName'],
            routes: [],
            path: getModulePath(moduleRight[i]['mModuleName']),
        })

        for (let j = 0; j < formRight.length; j++) {

            if (formRight[j]?.mModuleID === moduleRight[i]?.moduleID) {

                menu[i]['routes'].push({
                    name: formRight[j]['displayName'],
                    path: getModulePath(formRight[j]['displayName']),
                });
            }
        }
    }

    setMenu(menu)
    return menu;
}