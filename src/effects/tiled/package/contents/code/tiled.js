/*
    This file is part of the KDE project.

    SPDX-FileCopyrightText: 2012 Martin Gräßlin <mgraesslin@kde.org>

    SPDX-License-Identifier: GPL-2.0-or-later
*/

"use strict";

class TiledEffect {
  constructor() {
    effect.configChanged.connect(this.loadConfig.bind(this));
    effects.windowFrameGeometryChanged.connect(
      this.onWindowFrameGeometryChanged.bind(this)
    );
    // effects.windowMaximizedStateChanged.connect(
    // this.onWindowMaximizedStateChanged.bind(this));
    effect.animationEnded.connect(this.restoreForceBlurState.bind(this));
    effect.animationEnded.connect(this.onAnimationEnded.bind(this));

    this.loadConfig();
  }

  loadConfig() {
    this.duration = 100;
    this.distanceDuration = 0.15;
    this.curve = QEasingCurve.InCubic;
  }

  onWindowMaximizedStateChanged(window) {
    console.log("onWindowMaximizedStateChanged");
    if (!window.oldGeometry) {
      return;
    }

    if (window.dialog || window.splash || window.utility || window.transient) {
      return;
    }

    console.log("start");
    window.setData(Effect.WindowForceBlurRole, true);
    let oldGeometry = window.oldGeometry;
    const newGeometry = window.geometry;
    // if (oldGeometry.width == newGeometry.width && oldGeometry.height == newGeometry.height)
    // oldGeometry = window.olderGeometry;
    window.olderGeometry = Object.assign({}, window.oldGeometry);
    window.oldGeometry = Object.assign({}, newGeometry);

    const distance = Math.hypot(
      newGeometry.x +
        newGeometry.width / 2 -
        (oldGeometry.x + oldGeometry.width / 2),
      newGeometry.y +
        newGeometry.height / 2 -
        (oldGeometry.y + oldGeometry.height / 2)
    );

    const duration = this.duration + this.distanceDuration * distance;

    console.log(
      "animate from ",
      oldGeometry.width,
      oldGeometry.height,
      " to ",
      window.geometry.width,
      window.geometry.height
    );

    window.maximizeAnimation1 = animate({
      window: window,
      duration: animationTime(duration),
      animations: [
        {
          type: Effect.Size,
          to: {
            value1: newGeometry.width,
            value2: newGeometry.height,
          },
          from: {
            value1: oldGeometry.width,
            value2: oldGeometry.height,
          },
          curve: this.curve,
        },
        {
          type: Effect.Translation,
          to: {
            value1: 0,
            value2: 0,
          },
          from: {
            value1:
              oldGeometry.x -
              newGeometry.x -
              (newGeometry.width / 2 - oldGeometry.width / 2),
            value2:
              oldGeometry.y -
              newGeometry.y -
              (newGeometry.height / 2 - oldGeometry.height / 2),
          },
          curve: this.curve,
        },
      ],
    });

    // if (!window.resize) {
    //     console.log("second animation");
    //     window.maximizeAnimation2 =animate({
    //         window: window,
    //         duration: this.duration,
    //         animations: [{
    //             type: Effect.CrossFadePrevious,
    //             to: 1.0,
    //             from: 0.0,
    //             curve: QEasingCurve.OutCubic
    //         }]
    //     });
    // }
  }

  restoreForceBlurState(window) {
    // window.setData(Effect.WindowForceBlurRole, null);
  }

  onWindowFrameGeometryChanged(window, oldGeometry) {
    if (window.move || window.resize) {
      // console.log("ignoring user-initiated move/resize");
      return;
    }

    if (window.dialog || window.splash || window.utility || window.transient) {
      return;
    }

    if (window.skipTaskbar || window.skipPager || window.skipSwitcher) {
      return;
    }

    if (!window.normalWindow) {
      return;
    }

    console.log(
      "onWindowFrameGeometryChanged from ",
      oldGeometry.width,
      oldGeometry.height,
      " to ",
      window.geometry.width,
      window.geometry.height
    );
    if (window.maximizeAnimation1) {
      if (
        window.geometry.width != window.oldGeometry.width ||
        window.geometry.height != window.oldGeometry.height
      ) {
        console.log("still running");
        // cancel(window.maximizeAnimation1);
        // delete window.maximizeAnimation1;
        // if (window.maximizeAnimation2) {
        //     cancel(window.maximizeAnimation2);
        //     delete window.maximizeAnimation2;
        // }
        console.log("continue");
        window.oldGeometry = Object.assign({}, oldGeometry);
        // window.oldGeometry = Object.assign({}, window.olderGeometry);
        // window.olderGeometry = Object.assign({}, olderGeometry);
      } else {
        console.log("origin");
        // window.oldGeometry = Object.assign({}, oldGeometry);
        // window.olderGeometry = Object.assign({}, oldGeometry);
      }
    } else {
      console.log("borigin");
      window.oldGeometry = Object.assign({}, oldGeometry);
      window.olderGeometry = Object.assign({}, oldGeometry);
    }
    this.onWindowMaximizedStateChanged(window);
  }

  onAnimationEnded(window) {
    if (window.maximizeAnimation1) {
      cancel(window.maximizeAnimation1);
      delete window.maximizeAnimation1;
    }
    if (window.maximizeAnimation2) {
      cancel(window.maximizeAnimation2);
      delete window.maximizeAnimation2;
    }
  }
}

new TiledEffect();
