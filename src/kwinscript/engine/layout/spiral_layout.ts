// SPDX-FileCopyrightText: 2018-2019 Eon S. Jeon <esjeon@hyunmu.am>
// SPDX-FileCopyrightText: 2021 Mikhail Zolotukhin <mail@gikari.com>
//
// SPDX-License-Identifier: MIT

import { HalfSplitLayoutPart } from './layout_part'
import { FillLayoutPart } from './layout_part'
import { LayoutState, WindowsLayout } from '.'

import { WindowState, EngineWindow } from '../window'

import { Rect, RectDelta } from '../../util/rect'
import { Config } from '../../config'
import { Controller } from '../../controller'
import { Engine } from "..";

import { Action, Rotate, RotateReverse } from '../../controller/action'
import { TSProxy } from '../../extern/proxy'

export type SpiralLayoutPart = HalfSplitLayoutPart<
  FillLayoutPart,
  SpiralLayoutPart | FillLayoutPart
>

export default class SpiralLayout implements WindowsLayout {
  public static readonly id = 'SpiralLayout'
  public readonly classID = SpiralLayout.id
  public readonly name = 'Spiral Layout'
  public readonly icon = 'bismuth-spiral'

  private depth: number
  private parts: SpiralLayoutPart

  private config: Config

  private state: LayoutState

  constructor(
    config: Config,
    private proxy: TSProxy,
    public readonly uid: string
  ) {
    this.config = config

    this.state = new LayoutState(this.proxy, uid, this.classID)

    this.depth = 1
    this.parts = new HalfSplitLayoutPart(
      new FillLayoutPart(),
      new FillLayoutPart()
    )
    this.parts.angle = this.state.rotation
    this.parts.gap = this.config.tileLayoutGap
  }

  public adjust(
    area: Rect,
    tiles: EngineWindow[],
    basis: EngineWindow,
    delta: RectDelta
  ): void {
    this.parts.adjust(area, tiles, basis, delta)
  }

  public apply(
    _controller: Controller,
    tileables: EngineWindow[],
    area: Rect
  ): void {
    tileables.forEach((tileable) => (tileable.state = WindowState.Tiled))

    this.bore(tileables.length)

    this.parts.apply(area, tileables).forEach((geometry, i) => {
      tileables[i].geometry = geometry
    })
  }

  //handleShortcut?(ctx: EngineContext, input: Shortcut, data?: any): boolean;

  public toString(): string {
    return 'Spiral()'
  }

  private bore(depth: number): void {
    if (this.depth >= depth) {
      return
    }

    let hpart = this.parts
    let i
    for (i = 0; i < this.depth - 1; i++) {
      hpart = hpart.secondary as SpiralLayoutPart
    }

    const lastFillPart = hpart.secondary as FillLayoutPart
    let npart: SpiralLayoutPart
    while (i < depth - 1) {
      npart = new HalfSplitLayoutPart(new FillLayoutPart(), lastFillPart)
      npart.gap = this.config.tileLayoutGap
      switch ((i + 1) % 4) {
        case 0:
          npart.angle = 0
          break
        case 1:
          npart.angle = 90
          break
        case 2:
          npart.angle = 180
          break
        case 3:
          npart.angle = 270
          break
      }

      hpart.secondary = npart
      hpart = npart
      i++
    }
    this.depth = depth
  }

  private rotate(angle: 90 | 180 | -90 | -180): void {
    this.parts.angle = ((this.parts.angle + angle) % 360) as 0 | 90 | 180 | 270
    if (angle < 0) {
      angle += 360
    }
    this.parts.angle = ((this.parts.angle + angle) % 360) as 0 | 90 | 180 | 270
    this.state.rotation = this.parts.angle
  }

  public executeAction(engine: Engine, action: Action): void {
    if (action instanceof Rotate) {
      this.rotate(90)
    } else if (action instanceof RotateReverse) {
      this.rotate(-90)
    } else {
      action.executeWithoutLayoutOverride()
    }
  }
}
