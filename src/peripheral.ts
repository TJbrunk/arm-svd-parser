import { parseInteger } from "./svd_parser";
import { AddressBlock } from "./address_block";
import { Register, RegisterProperties } from "./register";
import { BaseElement } from "./base_element";
import { Interrupt } from "./interrupt";


// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html#elem_peripheral
export class Peripheral extends BaseElement{

    verion?: string;
    groupName?: string;
    baseAddress: number;
    properties?: RegisterProperties;
    addressBlocks? : Array<AddressBlock>;
    interrupts?: Array<Interrupt>;
    registers?: Array<Register>;

    // Not implemented:
    // alternateElement? : ??;
    // prepend? : string;
    // append? :string;
    // headerStructName?: ;
    // disableCondition? : string;

    constructor (xml: string) {
        super(xml);
        this.verion = xml['version'][0];
        this.groupName = xml['groupName'];// ? xml['groupName'][0] : null;
        this.baseAddress = parseInteger(xml['baseAddress'][0]);
    }

    public parseChildren(xml: string) {
        // Can be 0 or 1 Register property in a peripheral
        this.properties = new RegisterProperties(xml);
        // Can be multiple address blocks, so loop over all of them
        if(xml['addressBlock']) {
            this.addressBlocks = [];
            xml['addressBlock'].forEach(block => {
                this.addressBlocks.push(new AddressBlock(block));
            });
        }

        if(xml['interrupt']) {
            this.interrupts = [];
            xml['interrupt'].forEach(int => {
                this.interrupts.push(new Interrupt(int));
            });
        }

        let regs = xml['registers'] ? xml['registers'][0] : null;
        if(regs) {
            this.registers = [];
            regs.register.forEach(reg => {
                // The <registers></registers> block may also contain cluster element
                this.registers.push(new Register(reg));
            });
        }
    }
}