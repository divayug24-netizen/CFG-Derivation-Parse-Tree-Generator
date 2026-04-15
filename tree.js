/**
 * Draws a CFG Parse Tree with dynamic branching and smart spacing.
 */
function drawTree(canvas, steps) {
    if (!steps || steps.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = Math.max(800, steps.length * 100); 
    
    ctx.clearRect(0, 0, width, height);
    ctx.font = 'bold 14px JetBrains Mono';
    ctx.textAlign = 'center';

    /**
     * 1. DYNAMIC TREE BUILDER
     * Compares derivation steps to see exactly how symbols expand.
     */
    function buildDynamicTree(steps) {
        let root = { name: steps[0], children: [] };
        let activeNodes = [root];

        for (let i = 1; i < steps.length; i++) {
            let prev = steps[i - 1];
            let curr = steps[i];

            // Find the non-terminal that was expanded (the first capital letter)
            let ntIndex = -1;
            for (let j = 0; j < prev.length; j++) {
                if (prev[j] >= 'A' && prev[j] <= 'Z') {
                    ntIndex = j;
                    break;
                }
            }

            if (ntIndex !== -1) {
                // Determine what the NT became by looking at the change in the string
                // This logic identifies the replacement string in the derivation
                let nt = prev[ntIndex];
                let prefix = prev.substring(0, ntIndex);
                let suffix = prev.substring(ntIndex + 1);
                
                let expansion = curr.substring(prefix.length, curr.length - suffix.length);

                // Find the node in our tree that represents this specific NT
                // We look for the first 'leaf' non-terminal that matches
                let targetNode = findLeafNT(root, nt);
                
                if (targetNode) {
                    targetNode.children = expansion.split('').map(char => ({
                        name: char === 'ε' ? 'ε' : char,
                        children: []
                    }));
                }
            }
        }
        return root;
    }

    // Helper to find the correct non-terminal node to expand
    function findLeafNT(node, name) {
        if (node.name === name && node.children.length === 0) return node;
        for (let child of node.children) {
            let found = findLeafNT(child, name);
            if (found) return found;
        }
        return null;
    }

    const treeData = buildDynamicTree(steps);

    /**
     * 2. RECURSIVE DRAW FUNCTION WITH SMART SPACING
     */
    function drawNode(node, x, y, levelWidth) {
        // Draw connecting lines first (so they sit behind text)
        if (node.children && node.children.length > 0) {
            const childY = y + 80;
            const totalChildren = node.children.length;
            
            node.children.forEach((child, i) => {
                // Spacing logic: divide levelWidth into equal segments
                const childX = (x - levelWidth / 2) + (levelWidth / (totalChildren + 1)) * (i + 1);
                
                ctx.beginPath();
                ctx.moveTo(x, y + 5);
                ctx.lineTo(childX, childY - 20);
                ctx.strokeStyle = "#94A3B8";
                ctx.lineWidth = 2;
                ctx.stroke();

                drawNode(child, childX, childY, levelWidth / Math.max(totalChildren, 1.5));
            });
        }

        // Draw Node Background (Small circle for cleaner look)
        ctx.beginPath();
        ctx.arc(x, y - 5, 12, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        // Draw the text
        ctx.fillStyle = (node.name >= 'A' && node.name <= 'Z') ? "#6366F1" : "#1E293B";
        ctx.fillText(node.name, x, y);
    }

    // Initial call: Start at top-center with full width
    drawNode(treeData, width / 2, 60, width * 0.8);
}