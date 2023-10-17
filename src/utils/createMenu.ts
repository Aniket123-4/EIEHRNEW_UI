import { fetchMenuData } from "@/services/apiRequest/api";
import { getPackageId, getUserInLocalStorage, setMenu } from "./common";



const getModulePath = (name: string) => {
    const { verifiedUser, selectedPackageId }: any = getUserInLocalStorage();
    switch (name) {
        case "User Management":
            return "/user-management/list";

        case "Change Password":
            return "/UserManagement/change-password";

        case "Role Form Permission":
            return "/userrole";

        case "Candidate Display":
            return "/candidate/list";

        case "Institute Profile":
            return "/institute/list";

        case "Seat Booking":
            return "/booking/institute-list";

        case "Booking History":
            return "/booking/booking-order";

        case "Institute Candidate":
            return "/instituteCandidate/list";

        case "Institute Search":
            return "/institute/list";

        case "Institute":
            return "/institute";

        case "Booking":
            return "/booking";

        case "Candidate":
            return "/candidate";

        case "Room Master":
            return "/institute/list";

        case "Booking Collection":
            return "/booking/BookingReport";

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
        roleID:-1,
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

                // if (verifiedUser?.userCode !== "admin" && moduleRight[i]['mModuleName'] === "Booking") {
                //     menu[i]['routes'].push({
                //         name: "Order",
                //         path: getModulePath("Order"),
                //     });
                // }
            }
        }
    }

    setMenu(menu)
    return menu;
}