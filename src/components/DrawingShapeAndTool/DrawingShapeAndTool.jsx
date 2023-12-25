import React from "react";
import { Circle, Layer, Line, Rect, Star } from "react-konva";
import { TOOL_ITEMS } from "../../utils/constants";
import PropTypes from "prop-types";

const DrawingShapeAndTool = ({ lines }) => {
  return (
    <Layer>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {(line.tool === TOOL_ITEMS.PENCIL ||
            line.tool === TOOL_ITEMS.ERASER) && (
            <Line
              points={line.points}
              stroke={line.color}
              strokeWidth={line.brushSize}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {line.tool === TOOL_ITEMS.RECT && line.points.length === 4 && (
            <Rect
              x={line.points[0]}
              y={line.points[1]}
              width={line.points[2] - line.points[0]}
              height={line.points[3] - line.points[1]}
              fill="transparent"
              stroke={line.color}
              strokeWidth={line.brushSize}
            />
          )}
          {line.tool === TOOL_ITEMS.STAR && line.points.length === 4 && (
            <Star
              numPoints={7}
              innerRadius={Math.abs(line.points[2] - line.points[0]) / 2}
              outerRadius={Math.abs(line.points[2] - line.points[0])}
              x={(line.points[0] + line.points[2]) / 2}
              y={(line.points[1] + line.points[3]) / 2}
              fill="transparent"
              stroke={line.color}
              strokeWidth={line.brushSize}
            />
          )}
          {line.tool === TOOL_ITEMS.CIRCLE && line.points.length === 4 && (
            <Circle
              x={line.points[0]}
              y={line.points[1]}
              radius={Math.sqrt(
                Math.pow(line.points[2] - line.points[0], 2) +
                  Math.pow(line.points[3] - line.points[1], 2)
              )}
              fill="transparent"
              stroke={line.color}
              strokeWidth={line.brushSize}
            />
          )}
        </React.Fragment>
      ))}
    </Layer>
  );
};

DrawingShapeAndTool.propTypes = {
  lines: PropTypes.array.isRequired,
};

export default DrawingShapeAndTool;
