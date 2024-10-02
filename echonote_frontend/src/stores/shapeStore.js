import { create } from "zustand";

const shapeStore = create((set, get) => ({
  rectangles: {},
  circles: {},
  currentPage: 1,

  addRectangle: (rectangle) => {
    const currentPage = get().currentPage;
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [currentPage]: [...(state.rectangles[currentPage] || []), rectangle],
      },
    }));
  },

  addCircle: (circle) => {
    const currentPage = get().currentPage;
    set((state) => ({
      circles: {
        ...state.circles,
        [currentPage]: [...(state.circles[currentPage] || []), circle],
      },
    }));
  },

  updateRectangle: (index, newRect) => {
    const currentPage = get().currentPage;
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [currentPage]: state.rectangles[currentPage].map((rect, i) =>
          i === index ? newRect : rect
        ),
      },
    }));
  },

  updateCircle: (index, newCircle) => {
    const currentPage = get().currentPage;
    set((state) => ({
      circles: {
        ...state.circles,
        [currentPage]: state.circles[currentPage].map((circle, i) =>
          i === index ? newCircle : circle
        ),
      },
    }));
  },

  setRectangles: (rects) => {
    const currentPage = get().currentPage;
    set((state) => ({
      rectangles: {
        ...state.rectangles,
        [currentPage]: rects,
      },
    }));
  },

  setCircles: (circles) => {
    const currentPage = get().currentPage;
    set((state) => ({
      circles: {
        ...state.circles,
        [currentPage]: circles,
      },
    }));
  },

  getRectangles: () => {
    const currentPage = get().currentPage;
    return get().rectangles[currentPage] || [];
  },

  getCircles: () => {
    const currentPage = get().currentPage;
    return get().circles[currentPage] || [];
  },

  setCurrentPageForShape: (page) => set(() => ({ currentPage: page })),
}));

export default shapeStore;
