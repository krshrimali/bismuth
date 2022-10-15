// SPDX-FileCopyrightText: 2018-2019 Eon S. Jeon <esjeon@hyunmu.am>
// SPDX-FileCopyrightText: 2021 Mikhail Zolotukhin <mail@gikari.com>
//
// SPDX-License-Identifier: MIT

import FloatingLayout from './layout/floating_layout'

import { LayoutState, State, WindowsLayout } from './layout'

import { DriverSurface } from '../driver/surface'

import { wrapIndex } from '../util/func'
import { Config } from '../config'
import MonocleLayout from './layout/monocle_layout'
import TileLayout from './layout/tile_layout'
import CascadeLayout from './layout/cascade_layout'
import QuarterLayout from './layout/quarter_layout'
import SpiralLayout from './layout/spiral_layout'
import SpreadLayout from './layout/spread_layout'
import StairLayout from './layout/stair_layout'
import ThreeColumnLayout from './layout/three_column_layout'
import { TSProxy } from '../extern/proxy'

export class LayoutStoreEntry {
  public get currentLayout(): WindowsLayout {
    return this.loadLayout(this.currentID)
  }

  private currentIndex: number | null
  private currentID: string
  private layouts: { [key: string]: WindowsLayout }
  private previousID: string

  private config: Config

  constructor(config: Config, private proxy: TSProxy, private uid: string) {
    this.config = config
    this.currentIndex = 0
    this.layouts = {}

    const state = JSON.parse(this.proxy.getLayoutState(this.uid)) as State

    if (state.classID) {
      this.currentID = state.classID
    } else {
      this.currentID = this.config.layoutOrder[0]
    }
    this.previousID = this.currentID

    this.loadLayout(this.currentID)
  }

  public cycleLayout(step: -1 | 1): WindowsLayout {
    this.previousID = this.currentID
    this.currentIndex =
      this.currentIndex !== null
        ? wrapIndex(this.currentIndex + step, this.config.layoutOrder.length)
        : 0
    this.currentID = this.config.layoutOrder[this.currentIndex]
    return this.loadLayout(this.currentID)
  }

  public toggleLayout(targetID: string): WindowsLayout {
    const targetLayout = this.loadLayout(targetID)

    // Toggle if requested, set otherwise
    if (this.currentID === targetID) {
      this.currentID = this.previousID
      this.previousID = targetID
    } else {
      this.previousID = this.currentID
      this.currentID = targetID
    }

    this.updateCurrentIndex()
    return targetLayout
  }

  private updateCurrentIndex(): void {
    const idx = this.config.layoutOrder.indexOf(this.currentID)
    this.currentIndex = idx === -1 ? null : idx
  }

  private loadLayout(ID: string): WindowsLayout {
    let layout = this.layouts[ID]
    if (!layout) {
      // const state = JSON.parse(this.proxy.getLayoutState(this.surfId)) as State;
      const state = null
      if (state) {
        // layout = this.layouts[ID] = this.createLayoutFromId(state.class);
      } else {
        layout = this.layouts[ID] = this.createLayoutFromId(ID)
      }
    }
    return layout
  }

  private createLayoutFromId(id: string, state?: LayoutState): WindowsLayout {
    if (id == MonocleLayout.id) {
      return new MonocleLayout(this.config)
    } else if (id == QuarterLayout.id) {
      return new QuarterLayout(this.config)
    } else if (id == SpiralLayout.id) {
      return new SpiralLayout(this.config, this.proxy, this.uid)
    } else if (id == SpreadLayout.id) {
      return new SpreadLayout()
    } else if (id == StairLayout.id) {
      return new StairLayout()
    } else if (id == ThreeColumnLayout.id) {
      return new ThreeColumnLayout(this.config)
    } else if (id == TileLayout.id) {
      return new TileLayout(this.config, this.proxy, this.uid)
    } else {
      return new FloatingLayout()
    }
  }
}

export default class LayoutStore {
  private store: { [key: string]: LayoutStoreEntry }

  constructor(private config: Config, private proxy: TSProxy) {
    this.store = {}
  }

  public getCurrentLayout(srf: DriverSurface): WindowsLayout {
    return srf.ignore
      ? FloatingLayout.instance
      : this.getEntry(`${srf.screen}`).currentLayout
  }

  public cycleLayout(srf: DriverSurface, step: 1 | -1): WindowsLayout | null {
    if (srf.ignore) {
      return null
    }
    return this.getEntry(`${srf.screen}`).cycleLayout(step)
  }

  public toggleLayout(
    surf: DriverSurface,
    layoutClassID: string
  ): WindowsLayout | null {
    if (surf.ignore) {
      return null
    }
    return this.getEntry(`${surf.screen}`).toggleLayout(layoutClassID)
  }

  private getEntry(key: string): LayoutStoreEntry {
    if (!this.store[key]) {
      this.store[key] = new LayoutStoreEntry(this.config, this.proxy, key)
    }
    return this.store[key]
  }
}
