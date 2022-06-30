This is my personal experimental master feature-branch of [Bismuth-Forge/bismuth](https://github.com/Bismuth-Forge/bismuth).


This repo holds some patches that aren't clean enough yet to PR upstream but are perhaps useful enough to share anyway and I'm always grateful for usability feedback.

My end goal is to bring the best features of tiling-centric managers into a properly polished kwin experience consistent with kwin's heritage of being adaptable to a wide variety of workflows.

For the most part I'm just keeping the master branch in sync with what I'm daily-driving, though there are some branches with cherry-picked features/fixes that I hope are almost ready for upstream review into bismuth.

* **support changing "desktops" individually per monitor** (user feedback is desired before proposing API changes upstream to kwin)
* persistent layouts and window positions across kwin/bismuth restarts
* real-time layout adjustment while moving a window via mouse-drag
* additional options for placement of new spawned windows
* animation effect for moving windows (legitimately improves UX IMHO, giving a clue as to what went where instead of an instantaneous flash change)
* support moving focus/windows across monitor boundaries
* bugfixes related to window change events initiated by non-bismuth inputs (e.g. when the user has kwin move a window to a different screen/desktop/activity instead of using a bismuth keybind)
* new and unknown bugs, free of charge :)
