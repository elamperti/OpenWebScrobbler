import throttle from 'lodash/throttle';

import './draggablePane.css';

const MINIMUM_DISTANCE_FROM_EDGE = 24; // px
const OFFSET_FROM_EDGE = 8; // px

export function makeDraggable(container, draggableSelector, completelyDisableClickEvents = false) {
  let initialX = 0;
  let initialY = 0;
  let isDragging = false;

  const draggableElem = container.querySelector(draggableSelector);

  draggableElem.style.cursor = 'grab';
  draggableElem.onmousedown = dragMouseDown;
  draggableElem.addEventListener('click', fuckClick, true);

  const checkContainerWithinViewport = () => {
    const containerRect = container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (containerRect.left < 0) {
      container.style.left = `${OFFSET_FROM_EDGE}px`;
    } else if (containerRect.left + MINIMUM_DISTANCE_FROM_EDGE > viewportWidth) {
      container.style.left = viewportWidth - Math.min(MINIMUM_DISTANCE_FROM_EDGE, containerRect.width) + 'px';
    }

    if (containerRect.top < 0) {
      container.style.top = `${OFFSET_FROM_EDGE}px`;
    } else if (containerRect.top + MINIMUM_DISTANCE_FROM_EDGE > viewportHeight) {
      container.style.top = viewportHeight - Math.min(MINIMUM_DISTANCE_FROM_EDGE, containerRect.height) + 'px';
    }
  };

  window.addEventListener('resize', throttle(checkContainerWithinViewport, 30));

  function dragMouseDown(e: PointerEvent) {
    if (e.button !== 0) return; // Only left click

    initialX = e.clientX;
    initialY = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = throttle(dragElement, 30);
    draggableElem.style.cursor = 'move';
  }

  function dragElement(e: PointerEvent) {
    const deltaX = initialX - e.clientX;
    const deltaY = initialY - e.clientY;

    container.style.left = container.offsetLeft - deltaX + 'px';
    container.style.top = container.offsetTop - deltaY + 'px';

    isDragging = true;
    initialX = e.clientX;
    initialY = e.clientY;
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
    draggableElem.style.cursor = 'grab';
    checkContainerWithinViewport();
  }

  function fuckClick(e: PointerEvent) {
    if (isDragging || completelyDisableClickEvents) {
      e.stopImmediatePropagation();
      isDragging = false;
    }
  }
}
