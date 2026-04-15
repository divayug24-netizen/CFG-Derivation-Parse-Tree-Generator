class Grammar {
    constructor(rulesString) {
        this.rules = {};
        this.startSymbol = null;
        this.parseRules(rulesString);
    }

    parseRules(str) {
        const lines = str.split('\n').map(l => l.trim()).filter(l => l);
        lines.forEach((line, index) => {
            const [left, right] = line.split('->').map(s => s.trim());
            if (!this.startSymbol) this.startSymbol = left;
            if (!this.rules[left]) this.rules[left] = [];
            
            const productions = right.split('|').map(p => p.trim());
            this.rules[left].push(...productions);
        });
    }
}