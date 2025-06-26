import { useEffect } from 'react';
import { dia, shapes } from '@joint/core';

import './App.css'

function App() {
  useEffect(() => {
    const namespace = shapes;
    const graph = new dia.Graph({}, { cellNamespace: namespace });

    const paper = new dia.Paper({
      el: document.getElementById('paper'),
      width: 1280,
      height: 800,
      gridSize: 1,
      model: graph,
      background: { color: '#AAAAAA' },
      cellViewNamespace: namespace,
      linkPinning: false, // Prevent link being dropped in blank paper area
      defaultLink: () => new shapes.standard.Link(),
      defaultConnectionPoint: { name: 'boundary' },
      validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        // Prevent linking between ports within one element
        if (cellViewS === cellViewT) return false;
      }
    });

    const port = {
      label: {
        position: {
          name: 'left'
        },
        markup: [{
          tagName: 'text',
          selector: 'label'
        }]
      },
      attrs: {
        portBody: {
          magnet: true,
          width: 16,
          height: 16,
          x: -8,
          y: -8,
          fill: '#03071E'
        },
        label: {
          text: 'port'
        }
      },
      markup: [{
        tagName: 'rect',
        selector: 'portBody'
      }]
    };

    const model = new shapes.standard.Rectangle({
      position: { x: 275, y: 50 },
      size: { width: 640, height: 640 },
      attrs: {
        body: {
          fill: '#8ECAE6'
        }
      },
      ports: {
        items: [port] // add a port in constructor
      }
    });

    model.addPort(port); // add a port using Port API
    graph.addCell(model);
  }, []);

  return (
    <div id="paper">demo</div>
  );
}

export default App;
