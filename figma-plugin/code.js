// Liquid Glass Studio – Figma Plugin Sandbox
// Runs in the Figma plugin sandbox (no DOM access).

figma.showUI(__html__, { width: 480, height: 660, title: 'Liquid Glass Studio' });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'apply-glass') {
    try {
      const bytes = new Uint8Array(msg.imageData);
      const image = figma.createImage(bytes);

      const selection = figma.currentPage.selection;
      let targetNode;

      if (msg.insert || selection.length === 0) {
        const rect = figma.createRectangle();
        rect.name = 'Liquid Glass';
        rect.x = Math.round(figma.viewport.center.x - msg.width / 2);
        rect.y = Math.round(figma.viewport.center.y - msg.height / 2);
        figma.currentPage.appendChild(rect);
        targetNode = rect;
      } else {
        targetNode = selection[0];
      }

      if ('fills' in targetNode) {
        targetNode.resize(msg.width, msg.height);
        targetNode.fills = [
          {
            type: 'IMAGE',
            imageHash: image.hash,
            scaleMode: 'FILL',
          },
        ];
      }

      figma.currentPage.selection = [targetNode];
      figma.viewport.scrollAndZoomIntoView([targetNode]);
      figma.notify('✨ Liquid glass applied!');
      figma.ui.postMessage({ type: 'applied' });
    } catch (e) {
      figma.notify('Error: ' + e.message, { error: true });
      figma.ui.postMessage({ type: 'error', message: e.message });
    }
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};
