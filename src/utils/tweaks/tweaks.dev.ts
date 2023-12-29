import { Pane } from 'tweakpane';

import config from './config';
import { makeDraggable } from './draggablePane';

import('./quirks/tweakpaneFixes.css');

let __tweaksState;
const container = document.createElement('div');

const restoreTweaksState = () => {
  const tree = sessionStorage.getItem('tweaks');
  __tweaksState = tree ? JSON.parse(tree) : {};
  return !!tree;
};

const saveTweaksState = () => {
  sessionStorage.setItem('tweaks', JSON.stringify(__tweaksState));
};

// Add event listener for F2 key press
document.addEventListener('keydown', (event) => {
  if (event.shiftKey && event.key === '?') {
    container.classList.toggle('d-none');
  }
});

export const init = () => {
  container.id = 'tweaks-container';
  document.body.appendChild(container);

  const pane = new Pane({ title: 'Tweaks ✨', container });

  const draggableAnchor = document.createElement('div');
  draggableAnchor.classList.add('tweaks-grabber');
  draggableAnchor.textContent = '⣿';
  draggableAnchor.title = 'Hold and drag to move the panel';

  try {
    const tweakpaneTitle = document.getElementsByClassName('tp-rotv_b')[0];
    tweakpaneTitle.insertBefore(draggableAnchor, tweakpaneTitle.firstChild);
    makeDraggable(container, '.tweaks-grabber');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Could not attach draggable anchor to tweakpane title bar', error);
  }

  if (config.pane?.initialPosition) {
    const moveToInitialPosition = () => {
      if (config.pane.initialPosition.left) {
        container.style.left = config.pane.initialPosition.left;
      } else {
        container.style.right = config.pane.initialPosition.right;
        setTimeout(() => {
          container.style.left = `${container.getBoundingClientRect().left}px`;
          container.style.right = '';
        }, 100);
      }
      container.style.top = config.pane.initialPosition.top;
    };

    moveToInitialPosition();
  }

  // Collapse/expand pane
  let wasPreviouslyOpened = sessionStorage.getItem('tweaksPaneExpanded') === 'true';
  const mainPaneElement = document.getElementsByClassName('tp-rotv_t')[0].parentElement as HTMLElement;
  if (config.pane?.expanded === false && !wasPreviouslyOpened) {
    try {
      mainPaneElement.click();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Could not collapse tweakpane', error);
    }
  }

  mainPaneElement.addEventListener('click', () => {
    wasPreviouslyOpened = !wasPreviouslyOpened;
    sessionStorage.setItem('tweaksPaneExpanded', wasPreviouslyOpened.toString());
  });

  const treeWasEmpty = restoreTweaksState();

  // Initialize config and populate panel
  for (const category in config.params) {
    if (!__tweaksState[category]) {
      __tweaksState[category] = {};
    }
    const folder = pane.addFolder({
      title: category,
    });

    for (const tweak of config.params[category].tweaks) {
      let initialValue = tweak.value;
      if (__tweaksState[category][tweak.name] !== undefined) {
        initialValue = __tweaksState[category][tweak.name];
      } else {
        __tweaksState[category][tweak.name] = tweak.value;
      }

      let newItem;
      switch (tweak.type) {
        case 'button':
          newItem = folder.addButton({ title: tweak.name });
          newItem.on('click', tweak.value);
          break;

        case 'binding':
        default:
          newItem = folder.addBinding({ [tweak.name]: initialValue }, tweak.name, tweak.options);
      }

      newItem.on('change', ({ value }) => {
        __tweaksState[category][tweak.name] = value;
        saveTweaksState();

        if (tweak.options?.reload) {
          window.location.reload();
        }
      });
    }
  }

  // Save initial state after loading
  if (treeWasEmpty) saveTweaksState();
};

export const tweak = <T>(valueToUseInDevelopment: T, category: string, name: string, options = undefined): T => {
  if (__tweaksState?.[category]?.[name] !== undefined) {
    return __tweaksState[category][name];
  }

  return valueToUseInDevelopment;
};
