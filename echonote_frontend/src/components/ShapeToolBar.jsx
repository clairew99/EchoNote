import React, { useState, useRef, useEffect } from "react";
import * as St from "@components/styles/ShapeToolBar.style";
import {
  FaTrash,
  FaCircle,
  FaSquare,
  FaRegCheckCircle,
  FaRegCircle,
} from "react-icons/fa";
import { FaXmark, FaRegCircleXmark } from "react-icons/fa6";
import { MdOutlineFormatColorFill, MdOutlineLineWeight } from "react-icons/md";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import { Colorful } from "@uiw/react-color";

const ShapeToolBar = ({}) => {
  const { property, setFillColor, setStrokeColor } = shapeStore();
  const { mode, shapeMode, setRectangleMode, setCircleMode, setShapeMode } =
    drawingTypeStore();
  const [showFillPalette, setShowFillPalette] = useState(false);
  const [showStrokePalette, setShowStrokePalette] = useState(false);
  const fillPaletteRef = useRef(null);
  const strokePaletteRef = useRef(null);

  const toggleFillPalette = () => {
    if (showStrokePalette) setShowStrokePalette(!showStrokePalette);
    setShowFillPalette(!showFillPalette);
  };

  const toggleStrokePalette = () => {
    if (showFillPalette) setShowFillPalette(!showFillPalette);
    setShowStrokePalette(!showStrokePalette);
  };

  const handleRectangleMode = () => {
    setShowFillPalette(false);
    setShowStrokePalette(false);
    setRectangleMode();
  };

  const handleCircleMode = () => {
    setShowFillPalette(false);
    setShowStrokePalette(false);
    setCircleMode();
  };

  return (
    <St.DrawingToolContainer>
      <St.ToolBarButton>
        <St.IconContainer>
          {/* 도형선택 */}
          <St.ToggleButton
            as={FaSquare}
            isActive={shapeMode.rectangle}
            onClick={handleRectangleMode}
          />
          <St.ToggleButton
            as={FaCircle}
            isActive={shapeMode.circle}
            onClick={handleCircleMode}
          />
        </St.IconContainer>
        <St.Divider />
        <St.IconContainer>
          {/* 채우기색 고르기 */}
          <St.ColorPaletteContainer>
            <St.IconButton
              as={MdOutlineFormatColorFill}
              onClick={toggleFillPalette}
              color={property.fillColor}
              isActive={showFillPalette}
            />
            {showFillPalette && (
              <St.ColorPalette ref={fillPaletteRef}>
                <Colorful
                  color={property.fillColor}
                  onChange={(newColor) => {
                    setFillColor(newColor.hexa);
                  }}
                />
                <div>칠 유/무 여부가 들어갑니다</div>
              </St.ColorPalette>
            )}
          </St.ColorPaletteContainer>
          {/* 선색 고르기 */}
          <St.ColorPaletteContainer>
            <St.IconButton
              as={MdOutlineLineWeight}
              onClick={toggleStrokePalette}
              color={property.strokeColor}
              isActive={showStrokePalette}
            />
            {showStrokePalette && (
              <St.ColorPalette ref={strokePaletteRef}>
                <Colorful
                  color={property.strokeColor}
                  onChange={(newColor) => {
                    setStrokeColor(newColor.hexa);
                  }}
                />
                <div>선 굵기가 들어갑니다</div>
                <div>선 유/무 여부가 들어갑니다</div>
              </St.ColorPalette>
            )}
          </St.ColorPaletteContainer>
        </St.IconContainer>
        {/* <ColorPalette value={property.fillColor} onChange={setFillColor} /> */}
        <St.Divider />
        <St.IconContainer>
          {/* 도형 지우기, toolbar 닫기 */}
          <St.IconButton as={FaTrash} />
          <St.IconButton as={FaRegCircleXmark} onClick={setShapeMode} />
        </St.IconContainer>
      </St.ToolBarButton>
    </St.DrawingToolContainer>
  );
};

export default ShapeToolBar;
