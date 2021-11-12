/*
 * SPDX-FileCopyrightText: 2021 Ignacy Kajdan <git@verahawk.com>
 * SPDX-License-Identifier: MIT
 */

import QtQuick 2.15
import org.kde.plasma.components 3.0 as PlasmaComponents
import org.kde.plasma.core 2.0 as PlasmaCore
import org.kde.plasma.plasmoid 2.0
import org.kde.kquickcontrolsaddons 2.0

Item {
    id: root
    property bool isEnabled: true // If Bismuth is enabled in the system settings
    property int currentLayout: 0 // Index of the the current layout
    property int lastLayout: 0 // Index of the the last layout
    readonly property int floatingLayout: 7 // Index of the the floating layout

    // TODO: Cannot use i18n() here.
    ListModel {
        id: layoutModel

        ListElement {
            name: "Tile Layout"
            icon: "bismuth-tile"
        }
        ListElement {
            name: "Monocle Layout"
            icon: "bismuth-monocle"
        }
        ListElement {
            name: "Three-Column Layout"
            icon: "bismuth-column"
        }
        ListElement {
            name: "Spiral Layout"
            icon: "bismuth-spiral"
        }
        ListElement {
            name: "Spread Layout"
            icon: "bismuth-spread"
        }
        ListElement {
            name: "Stair Layout"
            icon: "bismuth-stair"
        }
        ListElement {
            name: "Quarter Layout"
            icon: "bismuth-quarter"
        }
        ListElement {
            name: "Floating Layout"
            icon: "bismuth-floating"
        }
    }

    Plasmoid.status: isEnabled ? PlasmaCore.Types.ActiveStatus : PlasmaCore.Types.Hidden
    Plasmoid.toolTipMainText: i18n("Bismuth")
    Plasmoid.toolTipSubText: layoutModel.get(currentLayout).name
    Plasmoid.icon: currentLayout !== floatingLayout ? "bismuth-monochrome" : "bismuth-monochrome-disabled"
    Plasmoid.preferredRepresentation: Plasmoid.compactRepresentation
    Plasmoid.fullRepresentation: FullRepresentation {} // Loaded from separate file
    Plasmoid.compactRepresentation: PlasmaCore.IconItem {
        active: compactMouseArea.containsMouse
        source: plasmoid.icon
        MouseArea {
            id: compactMouseArea

            anchors.fill: parent
            acceptedButtons: Qt.LeftButton | Qt.MiddleButton
            onClicked: {
                if (mouse.button == Qt.LeftButton) {
                    plasmoid.expanded = !plasmoid.expanded; // Show the full view
                } else if (mouse.button == Qt.MiddleButton) {
                    if (currentLayout !== floatingLayout) {
                        lastLayout = currentLayout;
                        currentLayout = floatingLayout;
                    } else {
                        currentLayout = lastLayout;
                    }
                }
            }
            onWheel: {
                if (plasmoid.configuration.enableScrolling) {
                    if (wheel.angleDelta.y < 0) {
                        if (currentLayout < layoutModel.count - 1) {
                            currentLayout++;
                        } else if (plasmoid.configuration.loopOver) {
                            currentLayout = 0;
                        }
                    } else {
                        if (currentLayout > 0) {
                            currentLayout--;
                        } else if (plasmoid.configuration.loopOver) {
                            currentLayout = layoutModel.count - 1;
                        }
                    }
                }
            }
        }
    }

    // Functions corresponding to the registered menu actions
    // FIXME: causes memory leak
    function action_setTileLayout() {
        currentLayout = 0;
    }

    function action_setMonocleLayout() {
        currentLayout = 1;
    }

    function action_setColumnLayout() {
        currentLayout = 2;
    }

    function action_setSpiralLayout() {
        currentLayout = 3;
    }

    function action_setSpreadLayout() {
        currentLayout = 4;
    }

    function action_setStairLayout() {
        currentLayout = 5;
    }

    function action_setQuarterLayout() {
        currentLayout = 6;
    }

    function action_setFloatingLayout() {
        currentLayout = 7;
    }

    function action_openSettings() {
        KCMShell.openSystemSettings("kcm_bismuth")
    }

    Component.onCompleted: {
        // Menu actions
        // FIXME: causes memory leak
        plasmoid.setAction("setTileLayout", layoutModel.get(0).name, layoutModel.get(0).icon)
        plasmoid.setActionGroup("setTileLayout", "layoutGroup")
        plasmoid.action("setTileLayout").checkable = true
        plasmoid.action("setTileLayout").checked = Qt.binding(function() { return (root.currentLayout === 0) })

        plasmoid.setAction("setMonocleLayout", layoutModel.get(1).name, layoutModel.get(1).icon)
        plasmoid.setActionGroup("setMonocleLayout", "layoutGroup")
        plasmoid.action("setMonocleLayout").checkable = true
        plasmoid.action("setMonocleLayout").checked = Qt.binding(function() { return (root.currentLayout === 1) })

        plasmoid.setAction("setColumnLayout", layoutModel.get(2).name, layoutModel.get(2).icon)
        plasmoid.setActionGroup("setColumnLayout", "layoutGroup")
        plasmoid.action("setColumnLayout").checkable = true
        plasmoid.action("setColumnLayout").checked = Qt.binding(function() { return (root.currentLayout === 2) })

        plasmoid.setAction("setSpiralLayout", layoutModel.get(3).name, layoutModel.get(3).icon)
        plasmoid.setActionGroup("setSpiralLayout", "layoutGroup")
        plasmoid.action("setSpiralLayout").checkable = true
        plasmoid.action("setSpiralLayout").checked = Qt.binding(function() { return (root.currentLayout === 3) })

        plasmoid.setAction("setSpreadLayout", layoutModel.get(4).name, layoutModel.get(4).icon)
        plasmoid.setActionGroup("setSpreadLayout", "layoutGroup")
        plasmoid.action("setSpreadLayout").checkable = true
        plasmoid.action("setSpreadLayout").checked = Qt.binding(function() { return (root.currentLayout === 4) })

        plasmoid.setAction("setStairLayout", layoutModel.get(5).name, layoutModel.get(5).icon)
        plasmoid.setActionGroup("setStairLayout", "layoutGroup")
        plasmoid.action("setStairLayout").checkable = true
        plasmoid.action("setStairLayout").checked = Qt.binding(function() { return (root.currentLayout === 5) })

        plasmoid.setAction("setQuarterLayout", layoutModel.get(6).name, layoutModel.get(6).icon)
        plasmoid.setActionGroup("setQuarterLayout", "layoutGroup")
        plasmoid.action("setQuarterLayout").checkable = true
        plasmoid.action("setQuarterLayout").checked = Qt.binding(function() { return (root.currentLayout === 6) })

        plasmoid.setAction("setFloatingLayout", layoutModel.get(7).name, layoutModel.get(7).icon)
        plasmoid.setActionGroup("setFloatingLayout", "layoutGroup")
        plasmoid.action("setFloatingLayout").checkable = true
        plasmoid.action("setFloatingLayout").checked = Qt.binding(function() { return (root.currentLayout === 7) })

        plasmoid.setActionSeparator("layoutSeparator")

        if (KCMShell.authorize("kcm_bismuth.desktop").length > 0) {
            plasmoid.setAction("openSettings", i18n("Configure Window Tiling..."), "bismuth-monochrome")
        }
    }
}
