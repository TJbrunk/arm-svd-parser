import { BaseElement } from "./base_element";
import { DimElement, AccessType, ProtectionType } from "./svd_parser";
import { WriteConstraint } from "./write_constraint";
import { FieldNode } from "./field";

export enum DataType {
    uint8 = 'uint8_t',
    uint16 = 'uint16_t',
    uint32 = 'uint32_t',
    // TODO:
}

// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html
export class Register extends BaseElement {

    dimElement: DimElement;
    displayName?: string;
    altGroup?: string;
    altRegister?: string;
    offset: number;
    properties?: RegisterProperties;
    dataType?: DataType;
    modifiedWrite?: ModifiedWriteType;
    writeContraint?: WriteConstraint;
    // readAction?: 
    fields?: FieldNode;

    constructor(xml: string) {
        super(xml);
        this.dimElement = {
            dim = xml['']
        }
    }

    public parseChildren(xml: string) {
        throw new Error("Method not implemented.");
    }
}

// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_special.html#registerPropertiesGroup_gr
export class RegisterProperties {
    size?: number;
    access?: AccessType;
    protection?: ProtectionType;
    resetValue?: number;
    resetMask?: number;

    constructor (xml: string) {
            this.size = xml['size'];

            if(this.size > 0) {
                this.access = xml['access'];
                this.protection = xml['protection'];
                this.resetValue = xml['resetValue'];
                this.resetMask = xml['resetMask'];
                return this;
            }
            else {
                return null;
            }
    }
}

// See: https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_field
// for descriptions of modified write values
export enum ModifiedWriteType {
    OneToClear = 'oneToClear',
    OneToSet = 'oneToSet',
    OneToToggle = 'oneToToggle',
    ZeroToClear = 'zeroToClear',
    ZeroToSet = 'zeroToSet',
    ZeroToToggle = 'zeroToToggle',
    Clear = 'clear',
    Set = 'set',
    Modify= 'modify'
}