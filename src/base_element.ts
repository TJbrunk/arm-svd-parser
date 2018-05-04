
// Common propterties and methods that all SVD elements should have/handle
export abstract class BaseElement {

    name: string;
    description?: string;

    constructor (xml: any) {
        this.name = xml.name[0];
        this.description = xml.description;
        };

    public abstract parseChildren(xml: string)
    }

    // abstract ParseChildren(xml: string) {

        // // Can be 0 or 1 Register property in a peripheral
        // element.props.properties = new RegisterProperties(xml);
        // // Can be multiple address blocks, so loop over all of them
        // if(xml['addressBlock']) {
        //     var tempBlocks: Array<AddressBlock> = [];
        //     xml['addressBlock'].forEach(block => {
        //         tempBlocks.push(new AddressBlock(block));
        //     });
        //     element.props.addressBlocks = tempBlocks;
        // }

        // if(xml['interrupt']) {
        //     var tempInt: Array<Interrupt> = [];
        //     xml['interrupt'].forEach(int => {
        //         tempInt.push(new Interrupt(int));
        //     });
        //     element.props.interrupts = tempInt;
        // }

        // return element
    // };