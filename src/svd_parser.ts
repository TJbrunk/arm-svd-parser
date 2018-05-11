import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { Register } from './register';
import { Peripheral } from './peripheral';
import { BaseElement } from './base_element';
import { Field } from './field';


// Parses a string into a number based on the format of the string, hex, dec, bin
export function parseNumber(value: string): number {
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

// Parses SVD files into equivalent typescript objects
export class SvdParser {

    // peripherals: Array<Peripheral> = [];
    peripherals: Map<string, Peripheral> = new Map();
    
    private parseXml (err, xml: string) {
        if(err) throw err;
        xml2js.parseString(xml, (err, result) => {
            // Skip over CPU/Device stuff for now

            result.device.peripherals[0].peripheral.forEach(peripheral => {
                // For each 'peripheral' in the peripherals section, parse it into the correct element

                // If this peripheral is derived from another, initialize it with all the same settings.
                // Any differences will be overwritten later
                let isDerived = peripheral.$ && peripheral.$.derivedFrom || null;
                let derived = null;

                if(isDerived) {
                    derived = this.peripherals.get(isDerived);
                }
                
                // derived = new Peripheral(peripheral);
                let perf = new Peripheral(peripheral, derived);
                perf.parseChildren(peripheral);

                // Add the peripheral to the array
                this.peripherals.set(perf.name, perf);
                // console.log(perf)
            });
        });

        console.log(this.peripherals.get('DMA').registers.get('STATUS').fields.get('STATE'))
    }

    public Parse(svdFile: string = 'EFM32GG995F1024.svd') {
        // let SVDFile = 'svd-example.xml';
        //let SVDFile = 'C:/Users/tylerb/Downloads/SiliconLabs.EFM32GG_DFP.5.4.1/SVD/EFM32GG/EFM32GG995F1024.svd';

        fs.readFile(svdFile, 'utf8', (err, xml) => this.parseXml(err, xml));
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






