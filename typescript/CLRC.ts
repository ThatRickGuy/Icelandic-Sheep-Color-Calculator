import * as request from "request-promise-native";
import * as icc from "./IcelandicColorCalculator";


export class CLRC {
    async getSheepFromCLRC(registrationNumber: string) : Promise<icc.SheepPhenotype> {
        const baseUrl = 'http://www.clrc.ca/search-registry/pedigree';
        const queryString = '?_lang=en&_breedcode=IL&_countrycode=CAN&_regnumberprefix&_regnumber=' + registrationNumber + '&_regnumbersuffix&_association=51';


        var options = {
            uri: baseUrl + queryString,
        };
        
         const result = await request.get(options)
            .then((body) => {   let response: icc.SheepPhenotype = this.parseCLRCSpec(this.getCLRCSpecFromContent(body)); 
                                return response;})
            . catch ((err) => { let response = { "origin": err.toString() }; 
                                console.log(response); }); 
         
        return result;
    }

    getCLRCSpecFromContent(content:string): string  {
        var StartOffset = content.indexOf("<h1>");
        var EndOffset = content.indexOf("</h1>", StartOffset);
        var title = content.substring(StartOffset, EndOffset);

        //best case, the CLRC code is typically the 3rd to last element in the title
        var segments = title.split(" ");
        var sReturn: string;
        if (segments.length > 3) {
            sReturn = segments[segments.length - 3];
        }
        return sReturn;
    }

    parseCLRCSpec(CLRCspec: string) : icc.SheepPhenotype {
        /*  http://www.isbona.com/images/pdf/CodingTheColorGenesForRegistration2-28-01.pdf?fbclid=IwAR122HSA14zX8W43TmlD2eprsldvo0XUfIrO6g6gdG-koHznYmlI5jIKur0
            Black B
            Brown ( Moorit) M
            White O or 0 (because people are worse than sheep)

            White 1
            Grey 2
            Badgerface 3
            Mouflon 4
            Solid 5
            Grey Mouflon (Single gene) 6

            Spotting S
            Not Spotted null

            Polled P
            Horns H
            Scurs C  */

            var g1: icc.Gene;
            var g2: icc.Gene;
            var g3a: icc.Gene;
            var g3b: icc.Gene;

            if (CLRCspec.includes("B")) {
                g1 = icc.Gene1.black;
            } else if (CLRCspec.includes("M")) {
                g1 = icc.Gene1.moorit;
            } else if (CLRCspec.includes("0") || CLRCspec.includes("O")) {
                g1 = icc.Gene1.unknown;
            }
            g2 = icc.Gene2.nonspotted;
            if (CLRCspec.includes("S")) {
                g2 = icc.Gene2.spotted;
            }

            var foundChar = "";
            if (CLRCspec.includes("1")) {
                foundChar = "1";
                g3a = icc.Gene3.solidwhite;
            } else if (CLRCspec.includes("2")) {
                foundChar = "2";
                g3a = icc.Gene3.grey;
            } else if (CLRCspec.includes("3")) {
                foundChar = "3";
                g3a = icc.Gene3.badgerface;
            } else if (CLRCspec.includes("4")) {
                foundChar = "4";
                g3a = icc.Gene3.mouflon
            } else if (CLRCspec.includes("5")) {
                foundChar = "5";
                g3a = icc.Gene3.solidnonwhite
            } else if (CLRCspec.includes("6")) {
                foundChar = "6";
                //g3a = icc.Gene3.GMSG
            }
            CLRCspec = CLRCspec.replace(foundChar,"");
            foundChar = "";
            if (CLRCspec.includes("1")) {
                foundChar = "1";
                g3b = icc.Gene3.solidwhite;
            } else if (CLRCspec.includes("2")) {
                foundChar = "2";
                g3b = icc.Gene3.grey;
            } else if (CLRCspec.includes("3")) {
                foundChar = "3";
                g3b = icc.Gene3.badgerface;
            } else if (CLRCspec.includes("4")) {
                foundChar = "4";
                g3b = icc.Gene3.mouflon
            } else if (CLRCspec.includes("5")) {
                foundChar = "5";
                g3b = icc.Gene3.solidnonwhite
            } else if (CLRCspec.includes("6")) {
                foundChar = "6";
                //g3b = icc.Gene3.GMSG
            }

            var shReturn: icc.SheepPhenotype;
            shReturn = new icc.SheepPhenotype();
            shReturn.gene1 = g1;
            shReturn.gene2 = g2;
            shReturn.gene3a = g3a;
            shReturn.gene3b = g3b;
            return shReturn;
    }
}