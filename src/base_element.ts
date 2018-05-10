// Common propterties and methods that all SVD elements should have/handle
export abstract class BaseElement {

    name: string;
    description?: string;

    constructor (xml: any, description?: string) {
        this.name = xml.name[0];

        if(description) {
            this.description = description;
        }
        else {
            this.description = xml.description && xml.description[0];
        }
    };

    public abstract parseChildren(xml: any)


    //https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_special.html#dimElementGroup_gr
    // The elements below appear on various levels and can be used to define arrays and lists in the code. Single descriptions get duplicated automatically into an array or a list. The subsequent is true for all elements of type dimableIdentifierType.
    //     To create arrays, use the placeholder [%s] at the end of a <name> and <displayName>. Do not define <dimIndex> in this case!
    //     To create lists, use the placeholder %s anywhere within or at the end of a <name> and <displayName>.
    // Note: 
    //     Some of the <name> and <displayName> elements can use both placeholders ([%s], %s), others just one. Refer to peripheral, register, cluster, and field for details.
    public static parseDimElement(xml: any) : Array<any> {
        let dims : Array<any> = Array<any>();

        // Get replacement values
        let dimValues = BaseElement.getDimValues(xml);
        let addressIncrement = parseInt(xml.dimIncrement[0]); // This is required
        dimValues.forEach((element, index) => {
            dims.push(
                {
                    name: xml.name[0].replace('%s', element),
                    description: xml.description[0].replace('%s', element),
                    addressOffset: parseInt(xml.addressOffset && xml.addressOffset[0]) + (addressIncrement * index)
                }
            )
        });
        
        return dims;
    }

    private static getDimValues(xml: any) : Array<string> {
        let indexes = Array<string>();
        try {
            // Try <dimIndex>A,B,C,D,E,Z</dimIndex> style
            let split = xml.dimIndex[0].split(',');

            if(split.length == parseInt(xml.dim[0])) {
                indexes = split;
            }
            // Try <dimIndex>3-6</dimIndex> style
            else {
                let startEnd = xml.dimIndex[0].split('-');
                let start = parseInt(startEnd[0]);
                let end = parseInt(startEnd[1]);

                for (let index = start; index <= end; index++) {
                    indexes.push(index.toString());
                }
            }
        }
        catch {
            // Style:
            // <register>
            //     <dim>4</dim> 
            //     <dimIncrement>4</dimIncrement> 
            //     <name>MyArr[%s]</name> 
            // ...
            // </register>
            indexes.push(xml.dim[0]);
        }
        finally {
            return indexes;
        }
    }
}