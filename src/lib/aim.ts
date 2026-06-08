/** El SVG de la nave apunta hacia arriba; +90° alinea con atan2 hacia el cursor. */
export const PLANE_AIM_OFFSET_DEG = 90;

export function aimAngleDeg(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): number {
  const rad = Math.atan2(toY - fromY, toX - fromX);
  return (rad * 180) / Math.PI + PLANE_AIM_OFFSET_DEG;
}

export function aimAngleRad(angleDeg: number): number {
  return ((angleDeg - PLANE_AIM_OFFSET_DEG) * Math.PI) / 180;
}
