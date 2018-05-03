import { parseInteger } from "./svd_parser";
import { BaseElement } from "./base_element";

// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html#elem_interrupt
export class Interrupt extends BaseElement {
    
    value: number;

    constructor (xml: string) {
        super(xml);
        this.value = parseInteger(xml['value'][0]);
        
        return this;
    }

    public parseChildren(xml: string) {
        // Interrupts don't have any childre
        return;
    }
}