export class DiceThrow {
    constructor(factor, multiplier, sides, modifier) {
        if (typeof factor === 'string') {
            const match = factor.match(
                /(?:(\d+)\s*\*\s*)?(\d*)d(\d+)(?:\s*([\+\-]\s*\d+))?/i
            );
            this.factor = parseInt(match[1]);
            this.multiplier = parseInt(match[2]);
            this.sides = parseInt(match[3]);
            this.modifier =
                typeof match[4] === 'string'
                    ? parseInt(match[4].replace(/\s/g, ''))
                    : 0;
        } else {
            this.factor = factor || 1;
            this.multiplier = multiplier || 1;
            this.sides = sides;
            this.modifier = modifier || 0;
        }
    }

    executeRandom() {
        let r = 0;
        for (let i = 0; i < this.multiplier; i++)
            r += Math.floor(Math.random() * this.sides);

        return r * this.factor + this.modifier;
    }

    toString() {
        let out = '';
        if (this.factor > 1) out += `${this.factor} * `;
        if (this.multiplier > 1) out += this.multiplier;
        out += `d${this.sides}`;
        if (this.modifier !== 0)
            out += `${
                this.modifier > 0
                    ? ` + ${this.modifier}`
                    : ` - ${this.modifier}`
            }`;

        return out;
    }
}
