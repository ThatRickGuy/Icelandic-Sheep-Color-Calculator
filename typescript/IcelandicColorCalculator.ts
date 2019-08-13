
export class Gene {
    name:string;
    isDominant:GeneExpression;
    constructor(Name:string, IsDominant: GeneExpression) {
        this.name=Name;
        this.isDominant=IsDominant;
    }
}

export class GenePair {
    phenotype: Gene;
    genotype: Gene;
    constructor(Phenotype: Gene, Genotype: Gene) {
        this.phenotype = Phenotype;
        this.genotype = Genotype;
    }
}

export class SheepPhenotype {
    gene1: Gene;
    gene2: Gene;
    gene3a: Gene;
    gene3b: Gene;

    toString():string {
        var sReturn = this.gene1.name + "," + this.gene2.name + "," + this.gene3a.name;
        if (this.gene3b != null) {
            sReturn += "," + this.gene3b.name;
        }
        return sReturn;
    }
}

class SheepHalf {
    gene1: Gene;
    gene2: Gene;
    gene3: Gene;
    constructor(Gene1:Gene, Gene2:Gene, Gene3:Gene){
        this.gene1=Gene1;
        this.gene2=Gene2;
        this.gene3=Gene3; 
    }
}

export class Sheep {
    gene1: GenePair;
    gene2: GenePair;
    gene3: GenePair;
    constructor(Gene1:GenePair, Gene2:GenePair, Gene3:GenePair){
        this.gene1=Gene1;
        this.gene2=Gene2;
        this.gene3=Gene3; 
    }

    toString():string {
       return this.gene1.phenotype.name + "," + this.gene1.genotype.name + "," + this.gene2.phenotype.name + "," + this.gene2.genotype.name + "," + this.gene3.phenotype.name + "," + this.gene3.genotype.name;
    }

    static fromParents(RamHalf:SheepHalf, EweHalf:SheepHalf): Sheep { 
        var gene1:GenePair = this.resolveGeneticPriority(RamHalf.gene1, EweHalf.gene1);
        var gene2:GenePair = this.resolveGeneticPriority(RamHalf.gene2, EweHalf.gene2);
        var gene3:GenePair = this.resolveGeneticPriority(RamHalf.gene3, EweHalf.gene3);
        
        return new Sheep(gene1, gene2, gene3);
    }

    static resolveGeneticPriority (RamGene:Gene, EweGene:Gene):GenePair {
        var gpReturn:GenePair;
        if (RamGene.isDominant == GeneExpression.Dominant)   {
            gpReturn = new GenePair(RamGene, EweGene);
        } else if (EweGene.isDominant == GeneExpression.Dominant) {
            gpReturn = new GenePair(EweGene, RamGene);
        } else if (RamGene.isDominant == GeneExpression.Recessive) {
            gpReturn = new GenePair(EweGene, RamGene);
        } else if (EweGene.isDominant == GeneExpression.Recessive) {
            gpReturn = new GenePair(RamGene, EweGene);
        } else if (RamGene.name > EweGene.name ) {
            gpReturn = new GenePair(RamGene, EweGene);
        } else {
            gpReturn = new GenePair(EweGene, RamGene);
        }

        return gpReturn;
    }

    resolvePhenotype():SheepPhenotype {
        var soReturn: SheepPhenotype= new SheepPhenotype();

        soReturn.gene1 = this.gene1.phenotype;
        soReturn.gene2 = this.gene2.phenotype;
        soReturn.gene3a = this.gene3.phenotype;
        //Only populate gene3b if a/b are both co-expressive and not the same gene
        if (this.gene3.phenotype.isDominant == GeneExpression.Coexpressive && 
            this.gene3.genotype.isDominant == GeneExpression.Coexpressive && 
            this.gene3.phenotype.name != this.gene3.genotype.name) {
                    soReturn.gene3b = this.gene3.genotype;
        }
        return soReturn;
    }
    
}


interface iGeneDictionary {
    [trait: string]: Gene;
}
interface iNumberDictionary {
    [sequence:string]: number;
}

enum GeneExpression {Recessive, Coexpressive, Dominant, NA}

export var Gene1:iGeneDictionary = {};
Gene1["moorit"] = new Gene("Moorit", GeneExpression.Recessive);
Gene1["black"] = new Gene("Black", GeneExpression.Dominant);
Gene1["unknown"] = new Gene("Unknown", GeneExpression.NA);
export var Gene2:iGeneDictionary = {};
Gene2["spotted"] = new Gene("Spotted", GeneExpression.Recessive);
Gene2["nonspotted"] = new Gene("Non-Spotted", GeneExpression.Dominant);
Gene2["unknown"] = new Gene("Unknown", GeneExpression.NA);
export var Gene3:iGeneDictionary = {};
Gene3["solidnonwhite"] = new Gene("Solid (non-white)", GeneExpression.Recessive);
Gene3["solidwhite"] = new Gene("Solid (white)", GeneExpression.Dominant);
Gene3["badgerface"] = new Gene("Badgerface", GeneExpression.Coexpressive);
Gene3["mouflon"] = new Gene("Mouflon", GeneExpression.Coexpressive);
Gene3["grey"] = new Gene("Grey", GeneExpression.Coexpressive);
Gene3["unknown"] = new Gene("Unknown", GeneExpression.NA);


export class Calculator {
    static leftPad(str: string, len: number, ch='.'): string {
        len = len - str.length + 1;
        return len > 0 ?
          new Array(len).join(ch) + str : str;
    }

    GetLambColorMatrix(Ram: Sheep, Ewe:Sheep) {
        var All = this.GenerateAllCombinations(Ram, Ewe);
        var TotalCombinations = All.length;
        let AggregateCombinations = new Map<String,number>();
        for (var i in All) {
            var s = All[i].toString();
            if (AggregateCombinations.has(s)) {
                AggregateCombinations.set(s, AggregateCombinations.get(s) +1); 
            } else {
                AggregateCombinations.set(s, 1);
            }
            
        }

        
        console.log("Total Possible Genotypes: " + All.length);
        console.log("Total Unique Genotypes: " + AggregateCombinations.size);
        console.log("");
        console.log("Count   % Result ");
        console.log("------------------------------------------------------------------");
        
        AggregateCombinations.forEach(function(value, key) {
            var hits = Calculator.leftPad(value.toString(), 5, ' ')
            var percent = Calculator.leftPad((value/All.length * 100).toFixed(0).toString(),3,' ');

            console.log(hits  + ' ' + percent + ' ' + key);
          });
          console.log("");
          console.log("");
          console.log("");
          console.log("Total Possible Phenotypes: " + All.length);
          console.log("Total Unique Phenotypes: " + AggregateCombinations.size);
          console.log("");
          console.log("Count   % Result ");
          console.log("------------------------------------------------------------------");
          
          let AggregatePhenotypes = new Map<String,number>();
          for (var i in All) {
              var s = All[i].resolvePhenotype().toString();
              if (AggregatePhenotypes.has(s)) {
                AggregatePhenotypes.set(s, AggregatePhenotypes.get(s) +1); 
              } else {
                AggregatePhenotypes.set(s, 1);
              }
          }
          AggregatePhenotypes.forEach(function(value, key) {
            var hits = Calculator.leftPad(value.toString(), 5, ' ')
            var percent = Calculator.leftPad((value/All.length * 100).toFixed(0).toString(),3,' ');

            console.log(hits  + ' ' + percent + ' ' + key);
          });
    }



    GenerateAllCombinations(Ram: Sheep, Ewe:Sheep):Sheep[] {
        var AllPossibleOutcomes:Sheep[]=[];
        var RamGene = this.GenerateSheepGene(Ram);
        var EweGene = this.GenerateSheepGene(Ewe);

        for (var g1 in RamGene) {
            for (var g2 in EweGene) {
                    
                    var lamb = Sheep.fromParents(RamGene[g1], EweGene[g2]);
                    AllPossibleOutcomes.push(lamb);
            }
        }
        return AllPossibleOutcomes;
    }

    GenerateSheepGene(parent: Sheep): SheepHalf[] {
        var firstGene:Gene[]=[];
        if (parent.gene1.phenotype == Gene1.unknown) {
            firstGene.push(Gene1.black);
            firstGene.push(Gene1.moorit);
        } else {
            firstGene.push(parent.gene1.phenotype);
        }
        if (parent.gene1.genotype == Gene1.unknown) 
        {
            firstGene.push(Gene1.black);
            firstGene.push(Gene1.moorit);
            if (parent.gene1.phenotype != Gene1.unknown) {
                firstGene.push(parent.gene1.phenotype);
            }
        } else {
            firstGene.push(parent.gene1.genotype);
        }

        var secondGene:Gene[]=[];
        if (parent.gene2.phenotype == Gene2.unknown) {
            secondGene.push(Gene2.spotted);
            secondGene.push(Gene2.nonSpotted);
        } else {
            secondGene.push(parent.gene2.phenotype);
        }
        if (parent.gene2.genotype == Gene2.unknown) 
        {
            secondGene.push(Gene2.spotted);
            secondGene.push(Gene2.nonspotted);
            if (parent.gene2.phenotype != Gene2.unknown) {
                secondGene.push(parent.gene2.phenotype);
            }
        } else {
            secondGene.push(parent.gene2.genotype);
        }
    

        var thirdGene:Gene[]=[];
        if (parent.gene3.phenotype == Gene3.unknown) {
            thirdGene.push(Gene3.badgerface);
            thirdGene.push(Gene3.grey);
            thirdGene.push(Gene3.mouflon);
            thirdGene.push(Gene3.solidnonwhite);
            thirdGene.push(Gene3.solidwhite);
        } else {
            thirdGene.push(parent.gene3.phenotype);
        }
        if (parent.gene3.genotype == Gene3.unknown) 
        {
            thirdGene.push(Gene3.badgerface);
            thirdGene.push(Gene3.grey);
            thirdGene.push(Gene3.mouflon);
            thirdGene.push(Gene3.solidnonwhite);
            thirdGene.push(Gene3.solidwhite);
            if (parent.gene3.phenotype != Gene3.unknown) {
                thirdGene.push(parent.gene3.phenotype);
                thirdGene.push(parent.gene3.phenotype);
                thirdGene.push(parent.gene3.phenotype);
                thirdGene.push(parent.gene3.phenotype);
            }
        } else {
            thirdGene.push(parent.gene3.genotype);
        }
        
        var AllPossibleGenes: SheepHalf[]=[];
        for (var g1 in firstGene) {
            for (var g2 in secondGene) {
                for (var g3 in thirdGene) {
                    var gene = firstGene[g1] + "-" + secondGene[g2] + "-" + thirdGene[g3];
                    var sh = new SheepHalf(firstGene[g1], secondGene[g2], thirdGene[g3]);
                    AllPossibleGenes.push(sh);
                }
            }
        } 

        return AllPossibleGenes;
    }
}