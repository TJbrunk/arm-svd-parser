import * as xml2js from 'xml2js';

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

export interface BaseElementOptions {
    name: string;
    verion?: string;
    description?: string;
    groupName?: string;
    baseAddress: number;
    properties?: RegisterProperties;
    addressBlocks? : Array<AddressBlock>;
    interrupts?: Array<Interrupt>;
    registers?: Register;
}

export class Base {

}

export class BaseElement {
    public props : BaseElementOptions;

    // Not implemented:
    // alternateElement? : ??;
    // prepend? : string;
    // append? :string;
    // headerStructName?: ;
    // disableCondition? : string;

    constructor (options: BaseElementOptions) {
        this.props = options;
        console.log(`name: ${this.props.name}\t description: ${this.props.description}\t base: ${this.props.baseAddress}`);
    }

    public static InitElement (xml: string) : BaseElement {
        // Get the high level properties
        // var x = Parser(xml2js.parseString(xml));
        let opts : BaseElementOptions = {
            // name: xml['name'],
            name: xml['name'][0],
            verion: xml['version'][0],
            description: xml['description'] ? xml['description'][0] : null,
            groupName: xml['groupName'] ? xml['groupName'][0] : null,
            baseAddress: xml['baseAddress'] ? parseInteger(xml['baseAddress'][0]): null,
        };

        let element = new BaseElement(opts);
        
        // Can be 0 or 1 Register property in a peripheral
        element.props.properties = new RegisterProperties(xml);
        // Can be multiple address blocks, so loop over all of them
        if(xml['addressBlock']) {
            var tempBlocks: Array<AddressBlock> = [];
            xml['addressBlock'].forEach(block => {
                tempBlocks.push(new AddressBlock(block));
            });
            element.props.addressBlocks = tempBlocks;
        }

        if(xml['interrupt']) {
            var tempInt: Array<Interrupt> = [];
            xml['interrupt'].forEach(int => {
                tempInt.push(new Interrupt(int));
            });
            element.props.interrupts = tempInt;
        }

        return element
    };


}

//https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html#elem_addressBlock
export class AddressBlock {
    offset: number;
    size: number;
    usage: string; // registers, buffer, reserved
    protection?: ProtectionType;

    constructor (xml: string) {
        this.offset = parseInteger(xml['offset'][0]);
        this.size = parseInteger(xml['size'][0]);
        this.usage = xml['usage'][0];
        // this.protection = this['protection'][0];
        return this;
    }
}

// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html#elem_interrupt
export class Interrupt {
    name: string;
    description?: string;
    value: number;

    constructor (xml: string) {
        var opts : BaseElementOptions = {name: '', baseAddress: 0, }
        this.name = xml['name'][0];
        this.value = parseInteger(xml['value'][0]);
        this.description = xml['description'] ? xml['description'][0] : null;
        
        return this;
    }
}

//https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html
export class Register  {
    cluster?: Cluster;
    register: Register;
    constructor (xml: string) {
        if(xml['cluster']) {
            this.cluster = new Cluster(xml);
        }
        this.register = xml['register'][0]
    }
}

// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_cluster
export class Cluster {
    dim: DimElement;
    name: string;
    description?: string;
    //alternateCluster:
    // headerStructName:
    offset: number;
    props?: RegisterProperties;
    registers?: [Register];
    clusters?: [Cluster];
    constructor (xml: string) {
        this.dim = null;
        this.name = xml['name'][0];
        this.offset = xml['offset'][0];
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

//https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_special.html#dimElementGroup_gr
export interface DimElement {
    dim: number;
    increment: number;
    index: number;
    name: string;
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
