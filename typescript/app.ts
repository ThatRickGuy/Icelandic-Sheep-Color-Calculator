import * as icc from "./IcelandicColorCalculator";
import * as CLRC from "./CLRC";

var calc = new icc.Calculator();
var ram = new icc.Sheep(new icc.GenePair(icc.Gene1.black, icc.Gene1.black),
                        new icc.GenePair(icc.Gene2.nonspotted, icc.Gene2.nonspotted),
                        new icc.GenePair(icc.Gene3.grey, icc.Gene3.unknown))
var ewe = new icc.Sheep(new icc.GenePair(icc.Gene1.black, icc.Gene1.black),
                        new icc.GenePair(icc.Gene2.nonspotted, icc.Gene2.nonspotted),
                        new icc.GenePair(icc.Gene3.grey, icc.Gene3.grey))


var all = calc.GetLambColorMatrix(ram, ewe);


var clrc = new CLRC.CLRC(); 
var request = clrc.getSheepFromCLRC('564456');
request.then(value => {
    console.log(value.toString());
})

