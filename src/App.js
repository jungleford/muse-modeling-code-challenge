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
const minPortWidth = 32;
const maxPortWidth = 400;
const portEdgeWidth = 8;

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
      name: 'left',
      args: {
        x: -minPortWidth,
        y: 0,
      },
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
      text: 'port',
      fill: '#03071E',
    },
  },
  markup: [{
    tagName: 'rect',
    selector: 'portBody',
  }]
};

let lastPortPosition = { x: 0, y: halfSquareWidth };

paper.on('element:port0:pointerdown', (elementView, event) => {
  const element = elementView.model;
  const startX = event.clientX;
  const startY = event.clientY;
  const elementTopLeftX = element.position().x;
  const elementTopLeftY = element.position().y;
  const portTopX = elementTopLeftX + element.prop('ports/groups/left-edge/position/args/x');
  const portTopY = elementTopLeftY + element.prop('ports/groups/left-edge/position/args/y') + element.portProp('port0', 'attrs/portBody/y');
  const portRightX = elementTopLeftX + element.prop('ports/groups/left-edge/position/args/x') - element.portProp('port0', 'attrs/portBody/x');
  const portRightY = elementTopLeftY + element.prop('ports/groups/left-edge/position/args/y');
  const portBottomX = elementTopLeftX + element.prop('ports/groups/left-edge/position/args/x');
  const portBottomY = elementTopLeftY + element.prop('ports/groups/left-edge/position/args/y') - element.portProp('port0', 'attrs/portBody/y');
  const portLeftX = elementTopLeftX + element.prop('ports/groups/left-edge/position/args/x') + element.portProp('port0', 'attrs/portBody/x');
  const portLeftY = elementTopLeftY + element.prop('ports/groups/left-edge/position/args/y');
  let hintOn = true;

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;

    if (hintOn) {
      // print log only once
      console.log(`startX: ${startX}, startY: ${startY}`);
      console.log(`portTopX: ${portTopX}, portTopY: ${portTopY}`);
      console.log(`portRightX: ${portRightX}, portRightY: ${portRightY}`);
      console.log(`portBottomX: ${portBottomX}, portBottomY: ${portBottomY}`);
      console.log(`portLeftX: ${portLeftX}, portLeftY: ${portLeftY}`);
      console.log('');
    }

    const dx = clientX - startX;
    const dy = clientY - startY;

    if (
      startY >= portTopY && startY <= portTopY + portEdgeWidth ||
      startX >= portRightX - portEdgeWidth && startX <= portRightX ||
      startY >= portBottomY - portEdgeWidth && startY <= portBottomY ||
      startX >= portLeftX && startX <= portLeftX + portEdgeWidth
    ) {
      // when the cursor is close to the edge of the port, that means drag to resize.
      if (hintOn) {
        console.log('Resizing!');
        console.log('');
        hintOn = false;
      }
      let dWidth = 0;
      if (
        dx > 0 && dy > 0 && startX > elementTopLeftX ||
        dx < 0 && dy < 0 && startX < elementTopLeftX ||
        dx > 0 && dy < 0 && startX > elementTopLeftX ||
        dx < 0 && dy > 0 && startX < elementTopLeftX
      ) {
        dWidth = Math.max(Math.abs(dx), Math.abs(dy));
      }
      if (
        dx > 0 && dy > 0 && startX < elementTopLeftX ||
        dx < 0 && dy < 0 && startX > elementTopLeftX ||
        dx > 0 && dy < 0 && startX < elementTopLeftX ||
        dx < 0 && dy > 0 && startX > elementTopLeftX
      ) {
        dWidth = -Math.max(Math.abs(dx), Math.abs(dy));
      }

      const newWidth = Math.min(maxPortWidth, Math.max(port0Position.width + dWidth, minPortWidth));

      element.portProp('port0', 'attrs/portBody/width', newWidth);
      element.portProp('port0', 'attrs/portBody/height', newWidth);
      element.portProp('port0', 'attrs/portBody/x', -newWidth / 2);
      element.portProp('port0', 'attrs/portBody/y', -newWidth / 2);

      const edge = element.prop('ports/groups/left-edge/position/name');
      if (edge === 'left') {
        element.portProp('port0', 'label/position/args/x', (-newWidth - minPortWidth) / 2);
        element.portProp('port0', 'label/position/args/y', 0);
      } else if (edge === 'top') {
        element.portProp('port0', 'label/position/args/x', 0);
        element.portProp('port0', 'label/position/args/y', (-newWidth - minPortWidth) / 2);
      } else if (edge === 'right') {
        element.portProp('port0', 'label/position/args/x', (newWidth + minPortWidth) / 2);
        element.portProp('port0', 'label/position/args/y', 0);
      } else if (edge === 'bottom') {
        element.portProp('port0', 'label/position/args/x', 0);
        element.portProp('port0', 'label/position/args/y', (newWidth + minPortWidth) / 2);
      }

      new0Position.width = newWidth;
      new0Position.height = newWidth;
      new0Position.x = -newWidth / 2;
      new0Position.y = -newWidth / 2;
    } else if (startX > portLeftX && startX < portRightX && startY > portTopY && startY < portBottomY) {
      // when the cursor is inside the port but leaves port edge more than 4px, that means drag to move.
      if (hintOn) {
        console.log('Moving!');
        console.log('');
        hintOn = false;
      }
      console.log(`dx: ${dx}, dy: ${dy}`);

      const edge = element.prop('ports/groups/left-edge/position/name');
      const newWidth = new0Position.width;

      if (edge === 'left') {
        // when the port is on the left edge
        element.portProp('port0', 'label/position/name', 'left');
        element.portProp('port0', 'label/position/args/x', (-newWidth - minPortWidth) / 2);
        element.portProp('port0', 'label/position/args/y', 0);
        let x = 0,
            y = lastPortPosition.y + dy;
        if (y > 0 && y < squareWidth) {
          // move on the left edge
          console.log(`left: (${x}, ${y})`);
          element.prop('ports/groups/left-edge/position/args', { x, y });
        } else if (y >= squareWidth && dx > lastPortPosition.x - squareWidth) {
          // turning point: from the left edge to the bottom edge
          y = squareWidth;
          x += lastPortPosition.x + dx;
          console.log(`bottom: (${x}, ${y})`);
          if (x >= squareWidth) {
            x = squareWidth;
          }
          element.prop('ports/groups/left-edge/position/name', 'bottom');
          element.prop('ports/groups/left-edge/position/args', { x, y });
        } else if (y <= 0 && dx > lastPortPosition.x - squareWidth) {
          // turning point: from the left edge to the top edge
          y = 0;
          x += lastPortPosition.x + dx;
          console.log(`top: (${x}, ${y})`);
          if (x >= squareWidth) {
            x = squareWidth;
          }
          element.prop('ports/groups/left-edge/position/name', 'top');
          element.prop('ports/groups/left-edge/position/args', { x, y });
        }
      } else if (edge === 'top') {
        // when the port is on the top edge
        element.portProp('port0', 'label/position/name', 'top');
        element.portProp('port0', 'label/position/args/x', 0);
        element.portProp('port0', 'label/position/args/y', (-newWidth - minPortWidth) / 2);
        let x = lastPortPosition.x + dx,
            y = 0;
        if (x > 0 && x < squareWidth) {
          // move on the top edge
          console.log(`top: (${x}, ${y})`);
          element.prop('ports/groups/left-edge/position/args', { x, y });
        } else if (x >= squareWidth && dy > 0) {
          // turning point: from the top edge to the right edge
          x = squareWidth;
          y += dy;
          console.log(`right: (${x}, ${y})`);
          if (y >= squareWidth) {
            y = squareWidth;
          }
          element.prop('ports/groups/left-edge/position/name', 'right');
          element.prop('ports/groups/left-edge/position/args', { x, y });
        } else if (x <= 0 && dy > 0) {
          // turning point: from the top edge to the left edge
          x = 0;
          y += dy;
          console.log(`left: (${x}, ${y})`);
          if (y >= squareWidth) {
            y = squareWidth;
          }
          element.prop('ports/groups/left-edge/position/name', 'left');
          element.prop('ports/groups/left-edge/position/args', { x, y });
        }
      } else if (edge === 'right') {
        // when the port is on the right edge
        element.portProp('port0', 'label/position/name', 'right');
        element.portProp('port0', 'label/position/args/x', (newWidth + minPortWidth) / 2);
        element.portProp('port0', 'label/position/args/y', 0);
        let x = squareWidth,
            y = lastPortPosition.y + dy;
        if (y > 0 && y < squareWidth) {
          // move on the right edge
          console.log(`right: (${x}, ${y})`);
          element.prop('ports/groups/left-edge/position/args', { x, y });
        } else if (y >= squareWidth && dx < squareWidth - lastPortPosition.x) {
          // turning point: from the right edge to the bottom edge
          y = squareWidth;
          x -= dx;
          console.log(`bottom: (${x}, ${y})`);
          if (x >= squareWidth) {
            x = squareWidth;
          }
          element.prop('ports/groups/left-edge/position/name', 'bottom');
          element.prop('ports/groups/left-edge/position/args', { x, y });
        } else if (y <= 0 && dx < squareWidth - lastPortPosition.x) {
          // turning point: from the right edge to the top edge
          y = 0;
          x -= dx;
          console.log(`top: (${x}, ${y})`);
          if (x >= squareWidth) {
            x = squareWidth;
          }
          element.prop('ports/groups/left-edge/position/name', 'top');
          element.prop('ports/groups/left-edge/position/args', { x, y });
        }
      } else if (edge === 'bottom') {
        // when the port is on the bottom edge
        element.portProp('port0', 'label/position/name', 'bottom');
        element.portProp('port0', 'label/position/args/x', 0);
        element.portProp('port0', 'label/position/args/y', (newWidth + minPortWidth) / 2);
        let x = lastPortPosition.x + dx,
            y = squareWidth;
        if (x > 0 && x < squareWidth) {
          // move on the bottom edge
          console.log(`bottom: (${x}, ${y})`);
          element.prop('ports/groups/left-edge/position/args', { x, y });
        } else if (x >= squareWidth && dy < squareWidth - lastPortPosition.y) {
          // turning point: from the bottom edge to the right edge
          x = squareWidth;
          y -= dy;
          console.log(`right: (${x}, ${y})`);
          if (y <= 0) {
            y = 0;
          }
          element.prop('ports/groups/left-edge/position/name', 'right');
          element.prop('ports/groups/left-edge/position/args', { x, y });
        } else if (x <= 0 && dy < squareWidth - lastPortPosition.y) {
          // turning point: from the bottom edge to the left edge
          x = 0;
          y -= dy;
          console.log(`left: (${x}, ${y})`);
          if (y <= 0) {
            y = 0;
          }
          element.prop('ports/groups/left-edge/position/name', 'left');
          element.prop('ports/groups/left-edge/position/args', { x, y });
        }
      }
    }
  };

  const onMouseUp = () => {
    // temp states for resizing
    port0Position.width = new0Position.width;
    port0Position.height = new0Position.height;
    port0Position.x = new0Position.x;
    port0Position.y = new0Position.y;

    // temp states for moving
    const { x, y } = element.getPortsPositions('left-edge')['port0'];
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
          args: { x: 0, y: halfSquareWidth },
        },
      },
    },
    items: [port0] // add a port in constructor
  }
});

graph.addCell(model);
