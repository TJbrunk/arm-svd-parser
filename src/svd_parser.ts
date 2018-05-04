import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { Register } from './register';
import { Peripheral } from './peripheral';
import { BaseElement } from './base_element';

export function parseInteger(value: string): number {
    if ((/^0b([01]+)$/i).test(value)) {
        return parseInt(value.substring(2), 2);
    }
    else if ((/^0x([0-9a-f]+)$/i).test(value)) {
        return parseInt(value.substring(2), 16);
    }
    else if ((/^[0-9]+/i).test(value)) {
        return parseInt(value, 10);
    }
    else if ((/^#[0-1]+/i).test(value)) {
        return parseInt(value.substring(1), 2);
    }
    return undefined;
}

export class SvdParser {

    public static parseXml (err, xml: string) {
        if(err) throw err;
        xml2js.parseString(xml, (err, result) => {
            // Skip over CPU/Device stuff for now

            // At least one peripheral must be defined, but handle if there is more than one
            result.device.peripherals[0].peripheral.forEach(peripheral => {
                // For each 'peripheral' in the peripherals section, parse it into the correct element
                var x = peripheral.$ && peripheral.$.derivedFrom || null;
                let perf = new Peripheral(peripheral);
                perf.parseChildren(peripheral);
                console.log(perf)
            });
        });
    }

    public static Parse(svdFile: string = 'C:/Users/tylerb/Downloads/SiliconLabs.EFM32GG_DFP.5.4.1/SVD/EFM32GG/EFM32GG995F1024.svd') {
        // let SVDFile = 'svd-example.xml';
        //let SVDFile = 'C:/Users/tylerb/Downloads/SiliconLabs.EFM32GG_DFP.5.4.1/SVD/EFM32GG/EFM32GG995F1024.svd';

        fs.readFile(svdFile, 'utf8', (err, xml) => SvdParser.parseXml(err, xml));
    }
}


/* Register Property Group properties */
// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_special.html#registerPropertiesGroup_gr

export enum ProtectionType {
    Secure = 's',
    NonSecure = 'n',
    Privileged = 'p'
}

export enum AccessType {
    ReadOnly = 1,
    ReadWrite,
    WriteOnly
}

export const ACCESS_TYPE_MAP = {
    'read-only': AccessType.ReadOnly,
    'write-only': AccessType.WriteOnly,
    'read-write': AccessType.ReadWrite,
    'writeOnce': AccessType.WriteOnly,
    'read-writeOnce': AccessType.ReadWrite
};



//https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_special.html#dimElementGroup_gr
export class DimElement {
    dim: number;
    increment: number;
    index?: number;
    name?: string;
    arrayIndex?: number; // This is header/enum data

    constructor(xml: any) {
        this.dim = xml.dim && xml.dim[0];
        this.increment = xml.dimIncrement && xml.dimIncrement[0];
        this.arrayIndex = xml.dimArrayIndex && xml.dimArrayIndex[0];
        this.index = xml.dimIndex && xml.dimIndex[0];
        this.name = xml.dimName && xml.dimName[0];
        return this;
    }
}


