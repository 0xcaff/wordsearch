class HighlightPainter {
  static get inputProperties() {
    return ["--rows", "--cols", "--highlighted", "--hovered"];
  }

  paint(ctx, geom, properties) {
    const rows = parseInt(properties.get("--rows").toString());
    const cols = parseInt(properties.get("--cols").toString());

    const highlighted = JSON.parse(properties.get("--highlighted").toString());
    const hovered = JSON.parse(properties.get("--hovered").toString());

    const height = geom.height / rows;
    const width = geom.width / cols;

    // for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
    //   for (let colIdx = 0; colIdx < cols; colIdx++) {
    //     ctx.beginPath();
    //     ctx.lineWidth = 1;
    //     ctx.rect(
    //       colIdx * width, rowIdx * height,
    //       width, height
    //     );
    //     ctx.stroke();
    //   }
    // }

    const drawLine = (startRow, startCol, endRow, endCol, isHovered) => {
      ctx.beginPath();
      ctx.moveTo(startCol * width + width / 2, startRow * height + height / 2);

      ctx.lineTo(endCol * width + width / 2, endRow * height + height / 2);
      ctx.lineCap = "round";
      ctx.lineWidth = width * 0.9;
      ctx.strokeStyle = isHovered ? "#F57F17" : "#ffeb3b";
      ctx.stroke();
    };

    const drawLineAtIdx = (idx, isHovered) => {
      const instance = highlighted[idx];
      const [startRow, startCol, endRow, endCol] = instance;
      drawLine(startRow, startCol, endRow, endCol, isHovered);
    };

    for (let idx = 0; idx < highlighted.length; idx++) {
      drawLineAtIdx(idx, false);
    }

    for (let idx = 0; idx < hovered.length; idx++) {
      const hoveredIdx = hovered[idx];
      drawLineAtIdx(hoveredIdx, true);
    }
  }
}

registerPaint("puzzle-grid-highlight", HighlightPainter);
