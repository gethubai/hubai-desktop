import { IColorTheme } from 'mo/model/colorTheme';
import { IExtension } from 'mo/model/extension';

const defaultColorThemeExtension: IExtension = require('./package.json');

// The below handle for theme extension is temporary,
// we will automatic load the extension package.

// Default
const defaultDark: IColorTheme = require('./themes/dark_defaults.json');
const defaultLight: IColorTheme = require('./themes/light_defaults.json');
const defaultHC: IColorTheme = require('./themes/hc_black_defaults.json');

// Theme
const darkPlus: IColorTheme = require('./themes/dark_plus.json');

Object.assign(darkPlus, defaultDark);

const darkVS: IColorTheme = require('./themes/dark_vs.json');

Object.assign(darkVS, defaultDark);

const lightPlus: IColorTheme = require('./themes/light_plus.json');

Object.assign(lightPlus, defaultLight);

const lightVS: IColorTheme = require('./themes/light_vs.json');

Object.assign(lightVS, defaultLight);

const hcBlack: IColorTheme = require('./themes/hc_black.json');

Object.assign(hcBlack, defaultHC);

const themes = defaultColorThemeExtension.contributes?.themes || [];

const themeDarkPlus = themes[0];
const themeLightPlus = themes[1];
const themeVSDark = themes[2];
const themeVSLight = themes[3];
const themeHCBlack = themes[4];

themes[0] = { ...themeDarkPlus, ...darkPlus };
themes[1] = { ...themeLightPlus, ...lightPlus };
themes[2] = { ...themeVSDark, ...darkVS };
themes[3] = { ...themeVSLight, ...lightVS };
themes[4] = { ...themeHCBlack, ...hcBlack };

export { defaultColorThemeExtension };
