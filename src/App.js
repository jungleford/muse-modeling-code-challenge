import { dia, shapes } from '@joint/core';

const namespace = shapes;
const graph = new dia.Graph({}, { cellNamespace: namespace });

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

const squareWidth = 480;
const halfSquareWidth = squareWidth / 2;
const minPortWidth = 16;
const maxPortWidth = 400;
const margin = minPortWidth / 2;

const port0Position = {
  width: minPortWidth,
  height: minPortWidth,
  x: - minPortWidth / 2,
  y: - minPortWidth / 2,
};
const new0Position = {
  width: minPortWidth,
  height: minPortWidth,
  x: - minPortWidth / 2,
  y: - minPortWidth / 2,
};

const port0 = {
  group: 'left-edge',
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
      event: 'element:port0:pointerdown',
      width: port0Position.width,
      height: port0Position.height,
      x: port0Position.x,
      y: port0Position.y,
      fill: '#03071E',
    },
    label: {
      text: 'resize',
      fill: '#03071E',
    },
  },
  markup: [{
    tagName: 'rect',
    selector: 'portBody',
  }]
};

paper.on('element:port0:pointerdown', (elementView, event) => {
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
      dx > 0 && dy > 0 && startX > elementTopLeftX + margin ||
      dx < 0 && dy < 0 && startX < elementTopLeftX + margin ||
      dx > 0 && dy < 0 && startX > elementTopLeftX + margin ||
      dx < 0 && dy > 0 && startX < elementTopLeftX + margin
    ) {
      dWidth = Math.max(Math.abs(dx), Math.abs(dy));
    }
    if (
      dx > 0 && dy > 0 && startX < elementTopLeftX + margin ||
      dx < 0 && dy < 0 && startX > elementTopLeftX + margin ||
      dx > 0 && dy < 0 && startX < elementTopLeftX + margin ||
      dx < 0 && dy > 0 && startX > elementTopLeftX + margin
    ) {
      dWidth = -Math.max(Math.abs(dx), Math.abs(dy));
    }

    const newWidth = Math.min(maxPortWidth, Math.max(port0Position.width + dWidth, 16));

    element.portProp('port0', 'attrs/portBody/width', newWidth);
    element.portProp('port0', 'attrs/portBody/height', newWidth);
    element.portProp('port0', 'attrs/portBody/x', - newWidth / 2);
    element.portProp('port0', 'attrs/portBody/y', - newWidth / 2);

    new0Position.width = newWidth;
    new0Position.height = newWidth;
    new0Position.x = - newWidth / 2;
    new0Position.y = - newWidth / 2;
  };

  const onMouseUp = () => {
    port0Position.width = new0Position.width;
    port0Position.height = new0Position.height;
    port0Position.x = new0Position.x;
    port0Position.y = new0Position.y;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  event.stopPropagation();
});


const port1 = {
  group: 'top-edge',
  id: 'port1',
  label: {
    position: {
      name: 'top'
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
      event: 'element:port1:pointerdown',
      width: port0Position.width,
      height: port0Position.height,
      x: port0Position.x,
      y: port0Position.y,
      fill: '#FF5733',
    },
    label: {
      text: 'drag',
      fill: '#FF5733',
    },
  },
  markup: [{
    tagName: 'rect',
    selector: 'portBody',
  }]
};

paper.on('element:port1:pointerdown', (elementView, event) => {
  const element = elementView.model;
  const startX = event.clientX;
  const startY = event.clientY;

  const onMouseMove = (e) => {
    const { x, y } = element.position();
    const { width, height }= element.size();
    const [ elementTopLeftX, elementTopLeftY ] = [ x, y ];
    const [ elementTopRightX, elementTopRightY ] = [ x + width, y ];
    const [ elementBottomRightX, elementBottomRightY ] = [ x + width, y + height ];
    const [ elementBottomLeftX, elementBottomLeftY ] = [ x, y + height ];
    const { clientX, clientY } = e;

    const dx = clientX - startX;
    const dy = clientY - startY;

    element.prop('ports/groups/top-edge/position/args', { dx: Math.min(halfSquareWidth, Math.max(-halfSquareWidth, dx)) });
    // element.prop('ports/groups/top-edge/position/args', { dy: Math.min(halfSquareWidth, Math.max(-halfSquareWidth, dy)) });
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  event.stopPropagation();
});

const model = new shapes.standard.Rectangle({
  position: { x: 400, y: 160 },
  size: { width: squareWidth, height: squareWidth },
  attrs: {
    body: {
      fill: '#8ECAE6',
    },
  },
  ports: {
    groups: {
      'left-edge': {
        position: {
          name: 'left',
          args: { dx: 0 },
        },
      },
      'top-edge': {
        position: {
          name: 'top',
          args: { dy: 0 },
        },
      },
    },
    items: [port0, port1] // add a port in constructor
  }
});

graph.addCell(model);
