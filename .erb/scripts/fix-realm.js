// Temporary fix for https://github.com/realm/realm-js/issues/6150

import { execSync } from 'child_process';
import webpackPaths from '../configs/webpack.paths';
import path from 'path';

//if (process.platform === 'win32') {
const realmPath = path.join(webpackPaths.appNodeModulesPath, 'realm');

console.log('Applying Realm fix on path: ' + realmPath);
/*execSync('npx prebuild-install --runtime napi', {
  cwd: realmPath,
  stdio: 'inherit',
}); */

console.log('Realm fix has been skipped!');
//}
