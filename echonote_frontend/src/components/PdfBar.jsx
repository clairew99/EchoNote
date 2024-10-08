import { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { useSidebarStore } from "@stores/sideBarStore";
import pageStore from "@stores/pageStore";
import {
  SidebarContainer,
  ImageContainer,
  DraggableImage,
  PageNumber,
} from "@components/styles/PdfBar.style";
import * as pdfjsLib from "pdfjs-dist";

// PDF.js에서 사용될 워커 설정 (필요에 따라 경로를 지정)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const PdfBar = () => {
  const { isPdfBarOpened } = useSidebarStore();
  const [images, setImages] = useState([]);
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  const pdfUrl =
    "https://timeisnullnull.s3.ap-northeast-2.amazonaws.com/le_Petit_Prince_%EB%B3%B8%EB%AC%B8.pdf";

  // PDF 파일에서 각 페이지를 이미지로 변환
  useEffect(() => {
    const loadPdf = async () => {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const numPages = pdf.numPages;
      const imageArray = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: 1.5 }); // 페이지의 스케일 설정
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // 페이지를 캔버스에 렌더링
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // 캔버스를 이미지 데이터 URL로 변환
        const imgSrc = canvas.toDataURL();
        imageArray.push({ id: i, name: `page ${i}`, src: imgSrc });
      }

      setImages(imageArray); // 이미지 배열로 업데이트
    };

    loadPdf();
  }, [pdfUrl]);

  const moveImage = (dragIndex, hoverIndex) => {
    const draggedImage = images[dragIndex];
    const updatedImages = [...images];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, draggedImage);
    setImages(updatedImages);
  };

  const enableDrag = () => {
    setIsDragEnabled(true);
  };

  const disableDrag = () => {
    setIsDragEnabled(false);
  };

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <SidebarContainer isOpened={isPdfBarOpened}>
        <ImageContainer>
          {images.map((image, index) => (
            <DraggableItem
              key={image.id}
              index={index}
              id={image.id}
              src={image.src}
              moveImage={moveImage}
              name={image.name}
              isDragEnabled={isDragEnabled} // 드래그 가능 여부
              enableDrag={enableDrag} // 드래그 활성화 함수
              disableDrag={disableDrag} // 드래그 비활성화 함수
            />
          ))}
        </ImageContainer>
      </SidebarContainer>
    </DndProvider>
  );
};

const DraggableItem = ({
  id,
  src,
  index,
  moveImage,
  name,
  isDragEnabled,
  enableDrag,
  disableDrag,
}) => {
  const ref = useRef(null);
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const { currentPage, setCurrentPage } = pageStore();

  // 드래그 앤 드롭 설정
  const [{ isDragging }, drag] = useDrag({
    type: "IMAGE",
    item: { id, index },
    canDrag: isDragEnabled, // 드래그 가능 여부 설정
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // 드래그 중인지 여부를 수집
    }),
  });

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover: (draggedItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const handleClick = () => {
    setCurrentPage(id); // 클릭한 페이지 ID를 setPages로 전달
  };

  // 길게 눌렀을 때 드래그 활성화
  const handleTouchStart = () => {
    const timeout = setTimeout(() => {
      setIsPressed(true);
      enableDrag(); // 1초 후 드래그 앤 드롭 활성화
    }, 1000); // 1초 대기
    setLongPressTimeout(timeout);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout); // 터치가 끝나면 타이머 해제
    setIsPressed(false);
    disableDrag();
  };

  // 드래그와 드롭 활성화
  drag(drop(ref));

  return (
    <div
      ref={ref}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onClick={handleClick}
    >
      <DraggableImage isDragging={isDragging} isPressed={isPressed}>
        <img src={src} alt={`Page ${index + 1}`} />
      </DraggableImage>
      <PageNumber>{name}</PageNumber>
    </div>
  );
};

export default PdfBar;
