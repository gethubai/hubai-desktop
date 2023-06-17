import 'reflect-metadata';
import React from 'react';
import './dependencyInjection';
import { create, Workbench } from 'mo';
import './mo-lib/style/mo.scss';
import extensions from './extensions';

const moInstance = create({
  extensions,
});

function Hello() {
  return moInstance.render(<Workbench />);
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
