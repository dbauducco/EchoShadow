import { focusWindow, keyboard } from './src/utilities/utils';

const go = async () => {
  focusWindow('Calculator');
  setTimeout(async () => {
    await keyboard.typeString('37+23=');
  }, 5000);
};

go();
