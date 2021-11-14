import { on, once, showUI } from '@create-figma-plugin/utilities'

import { CloseHandler, CreateRectanglesHandler } from './types'

export default function () {
  once<CreateRectanglesHandler>('CREATE_RECTANGLES', function (count: number) {
    const nodes: Array<SceneNode> = []
    for (let i = 0; i < count; i++) {
      const rect = figma.createRectangle()
      rect.x = i * 150
      rect.fills = [
        {
          type: 'SOLID',
          color: { r: 1, g: 0.5, b: 0 }
        }
      ]
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
    }
    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
    figma.closePlugin()
  })

  on('ADD_ICON', (icon) => {
    const iconNode = figma.createNodeFromSvg(icon.svg);
    iconNode.name = icon.name;
    iconNode.x = figma.viewport.center.x;
    iconNode.y = figma.viewport.center.y;
  });

  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin()
  })
  showUI({
    width: 325,
    height: 500
  })
}
