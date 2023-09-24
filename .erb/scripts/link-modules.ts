import fs from 'fs';
import webpackPaths from '../configs/webpack.paths';

const { srcNodeModulesPath } = webpackPaths;
const { appNodeModulesPath } = webpackPaths;

try {
  if (!fs.existsSync(srcNodeModulesPath) && fs.existsSync(appNodeModulesPath)) {
    fs.symlinkSync(appNodeModulesPath, srcNodeModulesPath, 'junction');
  }
} catch (error: any) {
  if (error.code === 'EEXIST') {
    console.warn(
      `A file or directory already exists at ${srcNodeModulesPath}.`
    );
    // Optionally, remove the existing file/directory or decide what action to take.
  } else {
    // If it's a different error, rethrow it.
    throw error;
  }
}
