import { IColorTheme } from 'mo/model/colorTheme';
import { IExtension } from 'mo/model/extension';

const monokaiColorThemeExtension: IExtension = require('./package.json');

// Default
const themeOneColors: IColorTheme = require('./themes/monokai-color-theme.json');

const themes = monokaiColorThemeExtension.contributes?.themes || [];

const themeOne = themes[0];

themes[0] = { ...themeOne, ...themeOneColors };

export { monokaiColorThemeExtension };
