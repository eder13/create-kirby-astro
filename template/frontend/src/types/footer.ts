export interface Footer {
    contact_name: ContactName;
    contact_address: ContactAddress;
    contact_country: ContactCountry;
    contact_instagram: ContactInstagram;
    contact_facebook: ContactFacebook;
    contact_x: ContactX;
}

interface ContactName {
    value: string;
}

interface ContactAddress {
    value: string;
}

interface ContactCountry {
    value: string;
}

interface ContactX {
    value: string;
}

interface ContactInstagram {
    value: string;
}

interface ContactFacebook {
    value: string;
}
