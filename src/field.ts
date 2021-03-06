// SVD Field element
//https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_field

import { AccessType, parseNumber } from './svd_parser'
import { WriteConstraint } from './write_constraint';
import { EnumeratedValue } from './enumerated_value';
import { ModifiedWriteType } from './register';
import { inherits } from 'util';
import { BaseElement } from './base_element';

export class Field extends BaseElement{

    public bitOffset: number;
    public bitWidth: number;
    
    public accessType?: AccessType;
    public modifiedWriteType?: ModifiedWriteType;
    public writeContraint?: WriteConstraint;
    // TODO: public readAction?: 
    public enumValues?: Map<string, EnumeratedValue>;

    constructor (xml: any) {
        // Set the name and description
        super(xml);
        this.accessType = xml.access && xml.access[0];
    }

    public parseBitOffset(xml: any, baseAddress: any) {
        // bit range and offset can be defined three different way. handle each and convert to Offset & width:
        if(xml.bitOffset) {
            this.bitOffset = parseNumber(xml.bitOffset && xml.bitOffset[0]);
            this.bitWidth = parseNumber(xml.bitWidth && xml.bitWidth[0]);
        }
        else if(xml.lsb){
            this.bitOffset = parseNumber(xml.lsb && xml.lsb[0]);
            let msb = parseNumber(xml.msb && xml.msb[0]);
            this.bitWidth = msb - this.bitOffset;
        }
        else if(xml.bitRange) {
            let bitRange: string = xml.bitRange[0];
            let msbRe = new RegExp(/^(?:\[)(\d+)(?:\:)/);
            let msb = msbRe.exec(bitRange) && msbRe.exec(bitRange)[1];
            let lsbRe = new RegExp(/(?:\:)(\d+)(?:\])$/);
            let lsb = lsbRe.exec(bitRange) && lsbRe.exec(bitRange)[1];

            this.bitOffset = parseNumber(lsb);
            this.bitWidth = parseNumber(msb) - this.bitOffset;
        }
    }

    public parseChildren(xml: any) {
        // Field may have enums defined
        if(xml.enumeratedValues) {
            this.enumValues = EnumeratedValue.parseEnum(xml.enumeratedValues[0]);
        }
        return;
    }
}