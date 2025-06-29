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

let lastPortPosition = { x: halfSquareWidth, y: 0 };
paper.on('element:port1:pointerdown', (elementView, event) => {
  const element = elementView.model;
  const startX = event.clientX;
  const startY = event.clientY;

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;

    const dx = clientX - startX;
    const dy = clientY - startY;
    console.log(`dx: ${dx}, dy: ${dy}`);

    const edge = element.prop('ports/groups/top-edge/position/name');

    if (edge === 'top') {
      // when the port is on the top edge
      let x = lastPortPosition.x + dx,
          y = 0;
      if (x > 0 && x < squareWidth) {
        // move on the top edge
        console.log(`top: (${x}, ${y})`);
        element.prop('ports/groups/top-edge/position/args', { x, y });
      } else if (x >= squareWidth && dy > 0) {
        // turning point: from the top edge to the right edge
        x = squareWidth;
        y += dy;
        console.log(`right: (${x}, ${y})`);
        if (y >= squareWidth) {
          y = squareWidth;
        }
        element.prop('ports/groups/top-edge/position/name', 'right');
        element.prop('ports/groups/top-edge/position/args', { x, y });
      } else if (x <= 0 && dy > 0) {
        // turning point: from the top edge to the left edge
        x = 0;
        y += dy;
        console.log(`left: (${x}, ${y})`);
        if (y >= squareWidth) {
          y = squareWidth;
        }
        element.prop('ports/groups/top-edge/position/name', 'left');
        element.prop('ports/groups/top-edge/position/args', { x, y });
      }
    } else if (edge === 'right') {
      // when the port is on the right edge
      let x = squareWidth,
          y = lastPortPosition.y + dy;
      if (y > 0 && y < squareWidth) {
        // move on the right edge
        console.log(`right: (${x}, ${y})`);
        element.prop('ports/groups/top-edge/position/args', { x, y });
      } else if (y >= squareWidth && dx < squareWidth - lastPortPosition.x) {
        // turning point: from the right edge to the bottom edge
        y = squareWidth;
        x -= dx;
        console.log(`bottom: (${x}, ${y})`);
        if (x >= squareWidth) {
          x = squareWidth;
        }
        element.prop('ports/groups/top-edge/position/name', 'bottom');
        element.prop('ports/groups/top-edge/position/args', { x, y });
      } else if (y <= 0 && dx < squareWidth - lastPortPosition.x) {
        // turning point: from the right edge to the top edge
        y = 0;
        x -= dx;
        console.log(`top: (${x}, ${y})`);
        if (x >= squareWidth) {
          x = squareWidth;
        }
        element.prop('ports/groups/top-edge/position/name', 'top');
        element.prop('ports/groups/top-edge/position/args', { x, y });
      }
    } else if (edge === 'bottom') {
      // when the port is on the bottom edge
      let x = lastPortPosition.x + dx,
          y = squareWidth;
      if (x > 0 && x < squareWidth) {
        // move on the bottom edge
        console.log(`bottom: (${x}, ${y})`);
        element.prop('ports/groups/top-edge/position/args', { x, y });
      } else if (x >= squareWidth && dy < squareWidth - lastPortPosition.y) {
        // turning point: from the bottom edge to the right edge
        x = squareWidth;
        y -= dy;
        console.log(`right: (${x}, ${y})`);
        if (y <= 0) {
          y = 0;
        }
        element.prop('ports/groups/top-edge/position/name', 'right');
        element.prop('ports/groups/top-edge/position/args', { x, y });
      } else if (x <= 0 && dy < squareWidth - lastPortPosition.y) {
        // turning point: from the bottom edge to the left edge
        x = 0;
        y -= dy;
        console.log(`left: (${x}, ${y})`);
        if (y <= 0) {
          y = 0;
        }
        element.prop('ports/groups/top-edge/position/name', 'left');
        element.prop('ports/groups/top-edge/position/args', { x, y });
      }
    } else if (edge === 'left') {
      // when the port is on the left edge
      let x = 0,
          y = lastPortPosition.y + dy;
      if (y > 0 && y < squareWidth) {
        // move on the left edge
        console.log(`left: (${x}, ${y})`);
        element.prop('ports/groups/top-edge/position/args', { x, y });
      } else if (y >= squareWidth && dx > lastPortPosition.x - squareWidth) {
        // turning point: from the left edge to the bottom edge
        y = squareWidth;
        x += lastPortPosition.x + dx;
        console.log(`bottom: (${x}, ${y})`);
        if (x >= squareWidth) {
          x = squareWidth;
        }
        element.prop('ports/groups/top-edge/position/name', 'bottom');
        element.prop('ports/groups/top-edge/position/args', { x, y });
      } else if (y <= 0 && dx > lastPortPosition.x - squareWidth) {
        // turning point: from the left edge to the top edge
        y = 0;
        x += lastPortPosition.x + dx;
        console.log(`top: (${x}, ${y})`);
        if (x >= squareWidth) {
          x = squareWidth;
        }
        element.prop('ports/groups/top-edge/position/name', 'top');
        element.prop('ports/groups/top-edge/position/args', { x, y });
      }
    }
  };

  const onMouseUp = () => {
    const { x, y } = element.getPortsPositions('top-edge')['port1'];
    lastPortPosition = { x, y };
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
          args: { x: halfSquareWidth, y: 0 },
        },
      },
    },
    items: [port0, port1] // add a port in constructor
  }
});

graph.addCell(model);
