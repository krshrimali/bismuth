/*
 * SPDX-FileCopyrightText: 2021 Ignacy Kajdan <git@verahawk.com>
 * SPDX-License-Identifier: MIT
 */

import QtQuick 2.15
import QtQuick.Controls 2.15 as Controls
import org.kde.kirigami 2.12 as Kirigami
import org.kde.plasma.components 3.0 as PlasmaComponents
import org.kde.plasma.core 2.0 as PlasmaCore
import org.kde.plasma.extras 2.0 as PlasmaExtras

PlasmaComponents.Page {
    id: fullRepresentation
    header: PlasmaExtras.PlasmoidHeading {
        PlasmaComponents.CheckBox {
            id: enableTilingButton
            anchors.fill: parent
            anchors.leftMargin: PlasmaCore.Units.smallSpacing
            text: i18n("Enable window tiling")
            checked: currentLayout !== floatingLayout
            onClicked: {
                if (currentLayout !== floatingLayout) {
                    lastLayout = currentLayout;
                    currentLayout = floatingLayout;
                } else {
                    currentLayout = lastLayout;
                }
            }
        }
    }

    Controls.ButtonGroup {
        id: buttonGroup
    }

    GridView {
        id: gridView
        anchors.fill: parent
        anchors.topMargin: PlasmaCore.Units.smallSpacing * 3
        anchors.leftMargin: PlasmaCore.Units.smallSpacing * 2
        anchors.bottomMargin: PlasmaCore.Units.smallSpacing * 2
        // TODO: Assign card padding to property and use it here instead of hardcoding
        anchors.rightMargin: PlasmaCore.Units.smallSpacing * -2 // Counter the card padding
        cellWidth: width / 4
        cellHeight: cellWidth
        interactive: false // Disable flickable behavior

        model: layoutModel

        delegate: PlasmaComponents.Button {
            id: card
            width: gridView.cellWidth - PlasmaCore.Units.smallSpacing * 4 // Card padding
            height: width
            checkable: true
            checked: model.index === root.currentLayout
            onClicked: root.currentLayout = model.index
            Controls.ButtonGroup.group: buttonGroup
            Controls.ToolTip.text: model.name // TODO: Any way to use "native" tooltip here?
            Controls.ToolTip.visible: hovered
            Controls.ToolTip.delay: 1500

            Kirigami.Icon {
                id: cardIcon
                anchors.fill: parent
                anchors.margins: PlasmaCore.Units.smallSpacing * 4
                source: model.icon
            }
        }
    }
}
