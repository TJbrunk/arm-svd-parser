import { ProtectionType, parseInteger } from "./svd_parser";


//https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html#elem_addressBlock
export class AddressBlock {
    offset: number;
    size: number;
    usage: string; // registers, buffer, reserved
    protection?: ProtectionType;

    constructor (xml: any) {
        this.offset = parseInteger(xml.offset && xml.offset[0]);
        this.size = parseInteger(xml.size && xml.size[0]);
        this.usage = xml.usage && xml.usage[0];
        // TODO:
        // this.protection = this['protection'][0]; 
        return this;
    }
}