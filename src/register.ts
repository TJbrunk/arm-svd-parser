import { BaseElement } from "./base_element";
import { DimElement, AccessType, ProtectionType, parseInteger, ACCESS_TYPE_MAP } from "./svd_parser";
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
    // fields?: FieldNode;

    constructor(xml: string) {
        super(xml);
        this.dimElement = new DimElement(xml);
        this.displayName = xml['displayName'] ? xml['displayName'][0] : undefined;
        this.altGroup = xml['alternateGroup'] ? xml['alternateGroup'][0] : undefined;
        this.altRegister = xml['alternateRegister'] ? xml['alternateRegister'][0] : undefined;
        this.offset = xml['addressOffset'] ? xml['addressOffset'][0] : undefined;
        this.properties = new RegisterProperties(xml);
        this.dataType = xml['dataType'] ? xml['dataType'][0] : undefined;
        this.modifiedWrite = xml['modifiedWriteValues'] ? xml['modifiedWriteValues'][0] : undefined;
        this.writeContraint = new WriteConstraint(xml);
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
            this.size = xml['size'] ? parseInteger(xml['size'][0]) : undefined;

            if(this.size > 0) {
                if(xml['access']) {
                    this.access = ACCESS_TYPE_MAP[xml['access'][0]]; 
                }
                if(xml['protection']) {
                    this.protection = <ProtectionType>xml['protection'][0];
                }
                this.resetValue = xml['resetValue'] ? xml['resetValue'][0] : undefined;
                this.resetMask = xml['resetMask'] ? xml['resetMask'][0] : undefined;
                return this;
            }
            else {
                return undefined;
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