// Function to handle the "Quick Examples"
const examples = {
    "1": { grammar: "S -> aSb | ab", target: "aabb" },
    "2": { grammar: "S -> AB\nA -> aA | a\nB -> bB | b", target: "aabb" },
    "3": { grammar: "S -> aSa | bSb | a | b | ε", target: "ababa" },
    "4": { grammar: "E -> E+T | T\nT -> T*F | F\nF -> (E) | id", target: "id+id*id" }
};

document.querySelectorAll('.btn-ex').forEach(button => {
    button.addEventListener('click', () => {
        const exId = button.getAttribute('data-example');
        const data = examples[exId];
        if (data) {
            document.getElementById('grammar').value = data.grammar;
            document.getElementById('target').value = data.target;
        }
    });
});

// Update the Generate button logic
document.getElementById('generate').addEventListener('click', () => {
    const grammarSource = document.getElementById('grammar').value;
    const targetString = document.getElementById('target').value;
    const outputDiv = document.getElementById('output');
    const placeholder = document.getElementById('placeholder');
    const grammarBody = document.querySelector('#grammar-table tbody');

    try {
        const grammar = new Grammar(grammarSource);
        
        // Fill the Grammar Table
        grammarBody.innerHTML = '';
        for (let nt in grammar.rules) {
            const row = `<tr><td><strong>${nt}</strong></td><td>${grammar.rules[nt].join(' | ')}</td></tr>`;
            grammarBody.insertAdjacentHTML('beforeend', row);
        }

        // CHANGE THIS PART: Call the new function names
        const leftmostSteps = deriveLeftmost(grammar, targetString);
        const rightmostSteps = deriveRightmost(grammar, targetString);

        if (leftmostSteps && rightmostSteps) {
            placeholder.classList.add('hidden');
            outputDiv.classList.remove('hidden');
            
            // Populate the two derivation boxes
            document.getElementById('left-stepper').innerText = leftmostSteps.join(' → ');
            document.getElementById('right-stepper').innerText = rightmostSteps.join(' → ');
            
            // Draw the tree
            const canvas = document.getElementById('parse-tree');
            drawTree(canvas, leftmostSteps);
        } else {
            alert("No derivation found for this string.");
        }
    } catch (e) {
        alert("Error: " + e.message);
    }
});