import { react } from '@hubai/core';
import { PackageStoreState } from '../models/packageStoreState';

const { Component } = react;

export default class PackageStoreService extends Component<PackageStoreState> {
  protected state: PackageStoreState;

  constructor() {
    super();
    this.state = {};
  }
}
