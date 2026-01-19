export default class DeviceHelper {
    static isMobile = () => window.innerWidth <= 767;
    static isMobileNavbarShown = () => window.innerWidth <= 1199;
}
