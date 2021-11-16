import { on, once, showUI } from '@create-figma-plugin/utilities'

import { CloseHandler, CreateRectanglesHandler } from './types'

export default function () {
  let resolveIcons = (icons: any) => {};

  const getIconsPromise  = (query = '') => {
    return new Promise<any>((resolve) => {
      
      resolveIcons = resolve;
    });
  }
  let withUI = false;

  let iconsPromise = getIconsPromise();

  // Create an invisible iframe UI to use network API's
  figma.showUI(
    `<script>
    window.onmessage = async (event) => {
      const query = event.data.pluginMessage.query;
      const style = event.data.pluginMessage.style;
      const weight = event.data.pluginMessage.weight;
      const res = await fetch("https://staging.iconoteka.com:8080/icons/style/"+style+"/weight/"+weight+"?" + new URLSearchParams({
        query,
    }));
      const json = await res.json();
      window.parent.postMessage({ pluginMessage: ['BACKEND_RESPONSE', json] }, "*");
    };
    </script><h1>Icons</h1>`,
    { 
      visible: false,
      width: 319,
      height: 500
    }
  );

  on('BACKEND_RESPONSE', (json) => {
    resolveIcons(json);
  });

  on('ADD_ICON', (icon) => {
    const iconNode = figma.createNodeFromSvg(icon.svg);
    iconNode.name = icon.name;
    iconNode.x = figma.viewport.center.x;
    iconNode.y = figma.viewport.center.y;
  });


  figma.parameters.on(
    'input',
    async ({ key, query, result, parameters }: ParameterInputEvent) => {
  
      switch(key) {
        case "style":
          result.setSuggestions(['Fill', 'Stroke'])
        break;
        case "weight":
          result.setSuggestions(['Light', 'Regular', 'Medium', 'Bold'])
        break;
        default:
          if (query.length < 3) {
            result.setLoadingMessage('Provide icon name');
          } else {
            result.setLoadingMessage('Loading icons');
            figma.ui.postMessage({ query, style: parameters.style, weight: parameters.weight });
            const icons = await iconsPromise;
  
            result.setSuggestions(
              icons.map((icon: any) => ({ name: icon.name, data: { name: icon.name, svg: icon.svg }, icon: icon.svg}))
            );
  
            iconsPromise = getIconsPromise(query);
          }
      }
    }
  );
  
  figma.on('run', ({ command, parameters }: RunEvent) => {
  
    if (parameters?.icon) {
      const icon = figma.createNodeFromSvg(parameters?.icon.svg);
      icon.name = parameters?.icon.name;
      icon.x = figma.viewport.center.x;
      icon.y = figma.viewport.center.y;
  
      figma.closePlugin(`${parameters?.icon.name} icon added`);
    } else {
      showUI({
        width: 319,
        height: 500
      });
    }
  });
  

}
