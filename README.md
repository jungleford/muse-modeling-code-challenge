# muse-modeling-code-challenge

## Requirements

1. You can resize the port at will.
2. You can drag the port along the border of the rectangle element at will, but the center point of the port cannot leave the border.

Hint: You can use JointJS library.

## Solution

I designed two solutions:
1. The final solution satisfies the requirement with one single port. This solution is in the latest master branch.
2. The other solution uses two ports, and displays the two use cases of resizing and moving separately. You can just pull the speical tag source "[two-ports](https://github.com/jungleford/muse-modeling-code-challenge/tree/two-ports)" to review this solution.

## Demo

For npm:
```bash
npm install

npm run dev
```

For pnpm:
```bash
pnpm install

pnpm run dev
```

Then open your browser and access http://localhost:5173/

## Screenshots

### Resize and Move

This shows "one port solution":

<img src="https://raw.githubusercontent.com/jungleford/muse-modeling-code-challenge/refs/heads/main/resize_move.gif" style="width: 800px;" alt="" />

### Resize

This shows "two ports solution":

<img src="https://raw.githubusercontent.com/jungleford/muse-modeling-code-challenge/refs/heads/main/resize.gif" style="width: 800px;" alt="" />

### Drag and Move

This shows "two ports solution":

<img src="https://raw.githubusercontent.com/jungleford/muse-modeling-code-challenge/refs/heads/main/move.gif" style="width: 800px;" alt="" />
