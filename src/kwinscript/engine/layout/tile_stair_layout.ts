// SPDX-FileCopyrightText: 2018-2019 Eon S. Jeon <esjeon@hyunmu.am>
// SPDX-FileCopyrightText: 2021 Mikhail Zolotukhin <mail@gikari.com>
//
// SPDX-License-Identifier: MIT

import { LayoutState, WindowsLayout } from ".";
import {
  RotateLayoutPart,
  HalfSplitLayoutPart,
  StackLayoutPart,
} from "./layout_part";

import { StairLayoutPart } from "./stair_part";

import { WindowState, EngineWindow } from "../window";

import {
  Action,
  DecreaseLayoutMasterAreaSize,
  DecreaseMasterAreaWindowCount,
  IncreaseLayoutMasterAreaSize,
  IncreaseMasterAreaWindowCount,
  Rotate,
  RotateReverse,
  RotatePart,
} from "../../controller/action";

import { clip, slide } from "../../util/func";
import { Rect, RectDelta } from "../../util/rect";
import { Config } from "../../config";
import { Controller } from "../../controller";
import { Engine } from "..";
import { TSProxy } from "../../extern/proxy";

export default class TabbedMasterLayout implements WindowsLayout {
  public static readonly MIN_MASTER_RATIO = 0.2;
  public static readonly MAX_MASTER_RATIO = 0.8;
  public static readonly id = "TabbedMasterLayout";
  public readonly classID = TabbedMasterLayout.id;
  public readonly name = "Tabbed-Master Layout";
  public readonly icon = "bismuth-tile";

  public get hint(): string {
    return String(this.numMasterTiles);
  }

  private parts: RotateLayoutPart<
    HalfSplitLayoutPart<StairLayoutPart, RotateLayoutPart<StackLayoutPart>>
  >;

  public get numMasterTiles(): number {
    return this.parts.inner.primarySize;
  }

  public set numMasterTiles(value: number) {
    this.parts.inner.primarySize = value;
    this.state.numMasterTiles = value;
  }

  private get masterRatio(): number {
    return this.parts.inner.ratio;
  }

  private set masterRatio(value: number) {
    this.parts.inner.ratio = value;
  }

  private config: Config;

  private state: LayoutState;

  constructor(
    config: Config,
    private proxy: TSProxy,
    public readonly uid: string
  ) {
    this.config = config;
    this.state = new LayoutState(this.proxy, uid, this.classID);

    this.parts = new RotateLayoutPart(
      new HalfSplitLayoutPart(
        new StairLayoutPart(),
        new RotateLayoutPart(new StackLayoutPart(this.config))
      )
    );

    const masterPart = this.parts.inner;
    masterPart.gap = masterPart.secondary.inner.gap = this.config.tileLayoutGap;

    this.parts.angle = this.state.rotation;
    this.parts.inner.secondary.angle = this.state.partRotation;
    this.numMasterTiles = this.state.numMasterTiles;
  }

  public adjust(
    area: Rect,
    tiles: EngineWindow[],
    basis: EngineWindow,
    delta: RectDelta
  ): void {
    this.parts.adjust(area, tiles, basis, delta);
  }

  public apply(
    _controller: Controller,
    tileables: EngineWindow[],
    area: Rect
  ): void {
    for (let i = 0; i < tileables.length; i++) {
      tileables[i].state = WindowState.Tiled;
      // if (i < this.numMasterTiles) {
      //   (tileables[i].window as DriverWindowImpl).client.opacity = 1;
      // }
    }

    this.parts.apply(area, tileables).forEach((geometry, i) => {
      tileables[i].geometry = geometry;
    });
  }

  public clone(): WindowsLayout {
    const other = new TabbedMasterLayout(this.config, this.proxy, this.uid);
    other.masterRatio = this.masterRatio;
    other.numMasterTiles = this.numMasterTiles;
    return other;
  }

  public executeAction(engine: Engine, action: Action): void {
    if (action instanceof DecreaseLayoutMasterAreaSize) {
      this.masterRatio = clip(
        slide(this.masterRatio, -0.05),
        TabbedMasterLayout.MIN_MASTER_RATIO,
        TabbedMasterLayout.MAX_MASTER_RATIO
      );
    } else if (action instanceof IncreaseLayoutMasterAreaSize) {
      this.masterRatio = clip(
        slide(this.masterRatio, +0.05),
        TabbedMasterLayout.MIN_MASTER_RATIO,
        TabbedMasterLayout.MAX_MASTER_RATIO
      );
    } else if (action instanceof IncreaseMasterAreaWindowCount) {
      // TODO: define arbitrary constant
      if (this.numMasterTiles < 10) {
        this.numMasterTiles += 1;
      }
      engine.showLayoutNotification();
    } else if (action instanceof DecreaseMasterAreaWindowCount) {
      if (this.numMasterTiles > 0) {
        this.numMasterTiles -= 1;
      }
      engine.showLayoutNotification();
    } else if (action instanceof Rotate) {
      this.parts.rotate(90);
      this.state.rotation = this.parts.angle;
    } else if (action instanceof RotateReverse) {
      this.parts.rotate(-90);
      this.state.rotation = this.parts.angle;
    } else if (action instanceof RotatePart) {
      this.parts.inner.secondary.rotate(90);
      this.state.partRotation = this.parts.inner.secondary.angle;
    } else {
      action.executeWithoutLayoutOverride();
      return;
    }
    engine.arrange(engine.currentSurface);
  }

  public toString(): string {
    return `TabbedMasterLayout(nmaster=${this.numMasterTiles}, ratio=${this.masterRatio})`;
  }
}
