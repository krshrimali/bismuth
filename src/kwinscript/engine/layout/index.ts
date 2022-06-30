// SPDX-FileCopyrightText: 2018-2019 Eon S. Jeon <esjeon@hyunmu.am>
// SPDX-FileCopyrightText: 2021 Mikhail Zolotukhin <mail@gikari.com>
//
// SPDX-License-Identifier: MIT

import { EngineWindow } from "../window";
import { Engine } from "..";

import { Controller } from "../../controller";
import { Action } from "../../controller/action";

import { Rect, RectDelta } from "../../util/rect";
import { TSProxy } from "../../extern/proxy";

export abstract class WindowsLayout {
  /* read-only */

  static readonly id: string;

  /**
   * Human-readable name of the layout.
   */
  abstract readonly name: string;

  /**
   * The icon name of the layout.
   */
  abstract readonly icon: string;

  /**
   * A string that can be used to show layout specific properties in the pop-up,
   * e.g. the number of master windows.
   */
  readonly hint?: string;

  /**
   * The maximum number of windows, that the layout can contain.
   */
  readonly capacity?: number;

  adjust?(
    area: Rect,
    tiles: EngineWindow[],
    basis: EngineWindow,
    delta: RectDelta
  ): void;

  abstract apply(
    controller: Controller,
    tileables: EngineWindow[],
    area: Rect
  ): void;

  executeAction?(engine: Engine, action: Action): void;

  abstract toString(): string;
}

export interface State {
  classID: string;
  numMasterTiles: number;
  rotation: 0 | 90 | 180 | 270;
}

export class LayoutState {
  constructor(
    private proxy: TSProxy,
    private readonly uid: string,
    private readonly classID: string
  ) {
    const vars = JSON.parse(this.proxy.getLayoutState(this.uid)) as State;
    vars.classID = classID;
    this.proxy.putLayoutState(this.uid, JSON.stringify(vars));
  }

  private toJSON(): string {
    const vars: { [rotation: string]: number } = {};
    vars.rotation = this.rotation;
    return JSON.stringify(vars);
  }

  public set rotation(angle: 0 | 90 | 180 | 270) {
    const vars = JSON.parse(this.proxy.getLayoutState(this.uid)) as State;
    vars.rotation = angle;
    this.proxy.putLayoutState(this.uid, JSON.stringify(vars));
  }

  public get rotation(): 0 | 90 | 180 | 270 {
    const vars = JSON.parse(this.proxy.getLayoutState(this.uid)) as State;
    if (vars.rotation == undefined) {
      return 0;
    }
    return vars.rotation;
  }

  public set numMasterTiles(num: number) {
    const vars = JSON.parse(this.proxy.getLayoutState(this.uid)) as State;
    vars.numMasterTiles = num;
    this.proxy.putLayoutState(this.uid, JSON.stringify(vars));
  }

  public get numMasterTiles(): number {
    const vars = JSON.parse(this.proxy.getLayoutState(this.uid)) as State;
    if (vars.numMasterTiles == undefined) {
      return 1;
    }
    return vars.numMasterTiles;
  }
}
