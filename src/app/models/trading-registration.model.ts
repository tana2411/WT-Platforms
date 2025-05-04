export interface TradingRegistration {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    prefix: string;
    jobTitle: string;
    phoneNumber: string;
    mobileNumber: string;
    whereDidYouHearAboutUs: string;
    companyName: string;
    companyInterest: string[];
    favoriteMaterials: string[];
}

export interface RegistrationResult {
    data: {
        accessToken: string;
        company: any; // TODO: Define the type
        companyUser: any; // TODO: Define the type
        user: any; // TODO: Define the type
    };
    message: string;
    status: string;
}

export interface CompanyInfo {
    countryCode: string;
    name: string;
    vatNumber: string;
    vatRegistrationCountry: string;
    addressLine1: string;
    city: string;
    country: string;
    stateProvince: string;
    postalCode: string;
    companyType: string;
}