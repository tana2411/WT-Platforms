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