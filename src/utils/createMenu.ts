// import { fetchMenuData } from "@/services/apiRequest/api";
// import { getPackageId, getUserInLocalStorage, setMenu } from "./common";



// const getModulePath = (name: string) => {
//     const { verifiedUser, selectedPackageId }: any = getUserInLocalStorage();

//     switch (name) {

//         case "Appoint Doctor":
//             return "/booking/doctor-slot-booking";

//         case "Disease Master":
//             return "/master/addDisease";

//         case "Complaint Master":
//             return "/master/addComplaint";

//         case "InfraStructure":
//             return "/master/AddDiseaseLink";

//         case "Investigation Parameter":
//             return "/investigation/AddInvParameter";

//         case "Manage Appointment":
//             return "/master/ManageAppointment";

//         case "Investigation Services":
//             return "/master/AddInvServices";

//         case "User Management":
//             return "/user-management/list";

//         case "Change Password":
//             return "/UserManagement/change-password";

//         case "Role Form Permission":
//             return "/userrole";

//         case "Candidate Display":
//             return "/candidate/list";

//         case "Appointment":
//             return "/booking/appointment-booking";

//         case "Search Patient":
//             return "/patient/search";

//         case "Patient Registration":
//             return "/patient/PatientRegistration";

//         case "Patient File":
//             return "/patient/PatientFile";

//         case "New Token No":
//             return "/patient/NewTokenNo";

//         case "Patient CheckOut":
//             return "/patient/PatientCheckOut";

//         case "Doctor Patient Status":
//             return "/patient/DoctorPatientStatus";

//         case "Item Master":
//             return "/medicalStore/itemMaster";

//         case "Direct Item Receipt":
//             return "/medicalStore/directItemReciept";

//         case "Item Status":
//             return "/medicalStore/itemStatus";

//         case "Supplier Master":
//             return "/medicalStore/SupplierMaster";

//         case "Reception":
//             return "/reception/search";

//         case "Doctor Patient":
//             return "/doctor/patient-list";

//         case "Patient Billing":
//             return "/patient/billing";

//         case "Hospital Billing Detail":
//             return "/billing/hospitalBillingDetail";

//         case "Patient Pharmacy Billing":
//             return "/billing/PatientPharmacyBilling";
        
//         case "Pay Partial Pharmacy Billing":
//             return "/billing/PatientPartialPharmacyBilling";
        
//         case "Token No":
//             return "/patient/AgeWiseSummary";

//         default:
//             if (verifiedUser.userTypeID === "11") {
//                 return "/candidate-dashboard";
//             } else {
//                 return "/";
//             }

//     }
// }

// export const createMenu = async () => {

//     const { verifiedUser, selectedPackageId }: any = getUserInLocalStorage();

//     const param: any = {
//         userID: verifiedUser?.userID,
//         orgID: verifiedUser?.orgID,
//         roleID: -1,
//         packageID: getPackageId(),
//         userTypeID: verifiedUser?.userTypeID,
//         portalTypeID: -1,
//         ipAddres: "",
//         type: 1
//     }
//     const menuData = await fetchMenuData(param);
//     const { moduleRight, formRight } = menuData.data;
//     const menu: any = [];


//     for (let i = 0; i < moduleRight.length; i++) {

//         menu.push({
//             name: moduleRight[i]['mModuleName'],
//             routes: [],
//             path: getModulePath(moduleRight[i]['mModuleName']),
//         })

//         for (let j = 0; j < formRight.length; j++) {

//             if (formRight[j]?.mModuleID === moduleRight[i]?.moduleID) {

//                 menu[i]['routes'].push({
//                     name: formRight[j]['displayName'],
//                     path: getModulePath(formRight[j]['displayName']),
//                 });
//             }
//         }
//     }

//     setMenu(menu)
//     return menu;
// }



import { FolderFilled, RightOutlined } from '@ant-design/icons';
import React from 'react';

import { fetchMenuData } from "@/services/apiRequest/api";
import { getPackageId, getUserInLocalStorage, setMenu } from "./common";
import { ca } from 'date-fns/locale';

const getModulePath = (name: string) => {
    const { verifiedUser }: any = getUserInLocalStorage();

    switch (name) {
        case "Appoint Doctor":
            return "/booking/doctor-slot-booking";
        case "Disease Master":
            return "/master/addDisease";
        case "Complaint Master":
            return "/master/addComplaint";
        case "InfraStructure":
            return "/master/AddDiseaseLink";
        case "Investigation Parameter":
            return "/investigation/AddInvParameter";
        case "Manage Appointment":
            return "/master/ManageAppointment";
        case "Investigation Services":
            return "/master/AddInvServices";
        case "User Management":
            return "/user-management/list";
        case "Change Password":
            return "/UserManagement/change-password";
        case "Role Form Permission":
            return "/userrole";
        case "Candidate Display":
            return "/candidate/list";
        case "Appointment":
            return "/booking/appointment-booking";
        case "Search Patient":
            return "/patient/search";
        case "Patient Registration":
            return "/patient/PatientRegistration";
        case "Patient File":
            return "/patient/PatientFile";
        case "New Token No":
            return "/patient/NewTokenNo";
        case "Patient CheckOut":
            return "/patient/PatientCheckOut";
        case "Doctor Patient Status":
            return "/patient/DoctorPatientStatus";
        case "Item Master":
            return "/medicalStore/itemMaster";
        case "Item Category Master":
            return "/medicalStore/ItemCategoryMaster";
        case "Unit Master":
            return "/medicalStore/unitMaster";    
            
        case "Relation Master":
            return "/master/relationMaster";
            case "Religion Master":
                return "/master/religionMaster";
            case "Blood Group Master":
                return "/master/bloodGroupMaster";
            case "Marital Status Master":
                return "/master/maritalStatusMaster";
            case "Gender Master":
                return "/master/genderMaster";
            case "Document Type Master":
                return "/master/DocumentTypeMaster";
            case "State Master":
                return "/master/StateMaster";
            case "District Master":
                return "/master/DistrictMaster";
            case "Country Master":
                return "/master/CountryMaster";               

        case "Direct Item Receipt":
            return "/medicalStore/directItemReciept";
        case "Item Status":
            return "/medicalStore/itemStatus";
        case "Supplier Master":
            return "/medicalStore/SupplierMaster";
        case "Reception":
            return "/reception/search";
        case "Doctor Patient":
            return "/doctor/patient-list";
        case "Patient Billing":
            return "/patient/billing";
        case "Hospital Billing Detail":
            return "/billing/hospitalBillingDetail";
        case "Patient Pharmacy Billing":
            return "/billing/PatientPharmacyBilling";
        case "Pay Partial Pharmacy Billing":
            return "/billing/PatientPartialPharmacyBilling";
        case "Token No":
            return "/patient/AgeWiseSummary";
        default:
            if (verifiedUser?.userTypeID === "11") {
                return "/candidate-dashboard";
            } else {
                return "/";
            }
    }
}

export const createMenu = async () => {
    const { verifiedUser }: any = getUserInLocalStorage();

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
        // Parent menu - FOLDER icon
        const parentItem = {
            name: moduleRight[i]['mModuleName'],
            path: getModulePath(moduleRight[i]['mModuleName']),
            icon: React.createElement(FolderFilled),
            routes: [] as any[],
        };

        // Children - ARROW icon
        for (let j = 0; j < formRight.length; j++) {
            if (formRight[j]?.mModuleID === moduleRight[i]?.moduleID) {
                parentItem.routes.push({
                    name: formRight[j]['displayName'],
                    path: getModulePath(formRight[j]['displayName']),
                    icon: React.createElement(RightOutlined),
                });
            }
        }
        
        menu.push(parentItem);
    }

    setMenu(menu);
    return menu;
}