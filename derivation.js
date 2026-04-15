/**
 * Generates a Leftmost Derivation path.
 */
function deriveLeftmost(grammar, target) {
    let queue = [{ current: grammar.startSymbol, steps: [grammar.startSymbol] }];
    let visited = new Set();

    while (queue.length > 0) {
        let { current, steps } = queue.shift();
        if (current === target) return steps;
        if (current.length > target.length + 5 || visited.has(current)) continue;
        visited.add(current);

        // Find the FIRST Non-Terminal (A-Z)
        let ntIndex = current.search(/[A-Z]/);
        if (ntIndex !== -1) {
            let nt = current[ntIndex];
            let productions = grammar.rules[nt] || [];
            for (let p of productions) {
                let replacement = p === 'ε' ? '' : p;
                let next = current.substring(0, ntIndex) + replacement + current.substring(ntIndex + 1);
                queue.push({ current: next, steps: [...steps, next] });
            }
        }
    }
    return null;
}

/**
 * Generates a Rightmost Derivation path.
 */
function deriveRightmost(grammar, target) {
    let queue = [{ current: grammar.startSymbol, steps: [grammar.startSymbol] }];
    let visited = new Set();

    while (queue.length > 0) {
        let { current, steps } = queue.shift();
        if (current === target) return steps;
        if (current.length > target.length + 5 || visited.has(current)) continue;
        visited.add(current);

        // Find the LAST Non-Terminal (A-Z)
        let ntIndex = -1;
        for (let i = current.length - 1; i >= 0; i--) {
            if (current[i] >= 'A' && current[i] <= 'Z') {
                ntIndex = i;
                break;
            }
        }

        if (ntIndex !== -1) {
            let nt = current[ntIndex];
            let productions = grammar.rules[nt] || [];
            for (let p of productions) {
                let replacement = p === 'ε' ? '' : p;
                let next = current.substring(0, ntIndex) + replacement + current.substring(ntIndex + 1);
                queue.push({ current: next, steps: [...steps, next] });
            }
        }
    }
    return null;
}