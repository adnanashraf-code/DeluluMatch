export const generateJaggedPath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  segments: number = 10,
  roughness: number = 5
) => {
  let path = `M ${startX} ${startY}`;
  
  const dx = (endX - startX) / segments;
  const dy = (endY - startY) / segments;

  for (let i = 1; i <= segments; i++) {
    const x = startX + dx * i + (Math.random() - 0.5) * roughness;
    const y = startY + dy * i + (Math.random() - 0.5) * roughness;
    path += ` L ${x} ${y}`;
  }

  return path;
};

export const createTearPolygon = (
  width: number,
  height: number,
  tearY: number,
  isTop: boolean
) => {
  const jagged = generateJaggedPath(0, tearY, width, tearY, 20, 8);
  
  if (isTop) {
    // Polygon for the top piece: (0,0) -> (W,0) -> (W,Y_jagged) -> (0,Y_jagged) -> close
    return `M 0 0 L ${width} 0 ${jagged.replace('M 0', 'L ')} L 0 ${tearY} Z`;
  } else {
    // Polygon for the bottom piece: (0,Y_jagged) -> (W,Y_jagged) -> (W,H) -> (0,H) -> close
    return `${jagged} L ${width} ${height} L 0 ${height} Z`;
  }
};
