import { dia, shapes } from '@joint/core';

const namespace = shapes;
const graph = new dia.Graph({}, { cellNamespace: namespace });

const portPosition = {
  width: 16,
  height: 16,
  x: -8,
  y: -8,
};
const newPosition = {
  width: 16,
  height: 16,
  x: -8,
  y: -8,
};

const paper = new dia.Paper({
  el: document.getElementById('paper'),
  width: 1280,
  height: 800,
  gridSize: 1,
  model: graph,
  background: { color: '#F5F5F5' },
  cellViewNamespace: namespace,
  linkPinning: false, // Prevent link being dropped in blank paper area
});

const port = {
  group: 'edge',
  id: 'port0',
  label: {
    position: {
      name: 'left'
    },
    markup: [{
      tagName: 'text',
      selector: 'label',
      attributes: {
        'pointer-events': 'none',
        'cursor': 'default',
      },
    }],
  },
  attrs: {
    portBody: {
      event: 'element:resize:pointerdown',
      width: portPosition.width,
      height: portPosition.height,
      x: portPosition.x,
      y: portPosition.y,
      fill: '#03071E',
    },
    label: {
      text: 'port',
    },
  },
  markup: [{
    tagName: 'rect',
    selector: 'portBody',
  }]
};

paper.on('element:resize:pointerdown', (elementView, event) => {
  const element = elementView.model;
  const startX = event.clientX;
  const startY = event.clientY;

  const onMouseMove = (e) => {
    const { x, y } = element.position();
    const [ elementTopLeftX, elementTopLeftY ] = [ x, y ];
    const { clientX, clientY } = e;

    const dx = clientX - startX;
    const dy = clientY - startY;

    let dWidth = 0;
    if (
      dx > 0 && dy > 0 && startX > elementTopLeftX + 8 ||
      dx < 0 && dy < 0 && startX < elementTopLeftX + 8 ||
      dx > 0 && dy < 0 && startX > elementTopLeftX + 8 ||
      dx < 0 && dy > 0 && startX < elementTopLeftX + 8
    ) {
      dWidth = Math.max(Math.abs(dx), Math.abs(dy));
    }
    if (
      dx > 0 && dy > 0 && startX < elementTopLeftX + 8 ||
      dx < 0 && dy < 0 && startX > elementTopLeftX + 8 ||
      dx > 0 && dy < 0 && startX < elementTopLeftX + 8 ||
      dx < 0 && dy > 0 && startX > elementTopLeftX + 8
    ) {
      dWidth = -Math.max(Math.abs(dx), Math.abs(dy));
    }

    const newWidth = Math.min(400, Math.max(portPosition.width + dWidth, 16));

    element.portProp('port0', 'attrs/portBody/width', newWidth);
    element.portProp('port0', 'attrs/portBody/height', newWidth);
    element.portProp('port0', 'attrs/portBody/x', - newWidth / 2);
    element.portProp('port0', 'attrs/portBody/y', - newWidth / 2);

    newPosition.width = newWidth;
    newPosition.height = newWidth;
    newPosition.x = - newWidth / 2;
    newPosition.y = - newWidth / 2;
  };

  const onMouseUp = () => {
    portPosition.width = newPosition.width;
    portPosition.height = newPosition.height;
    portPosition.x = newPosition.x;
    portPosition.y = newPosition.y;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  event.stopPropagation();
});

const model = new shapes.standard.Rectangle({
  position: { x: 400, y: 160 },
  size: { width: 480, height: 480 },
  attrs: {
    body: {
      fill: '#8ECAE6',
    },
  },
  ports: {
    groups: {
      edge: {
        position: {
          name: 'left',
          args: { dx: 0 },
        },
      },
    },
    items: [port] // add a port in constructor
  }
});

//model.addPort(port); // add a port using Port API

graph.addCell(model);
