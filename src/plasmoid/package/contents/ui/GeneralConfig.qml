/*
 * SPDX-FileCopyrightText: 2021 Ignacy Kajdan <git@verahawk.com>
 * SPDX-License-Identifier: MIT
 */

import QtQuick 2.15
import QtQuick.Controls 2.15 as Controls
import org.kde.kirigami 2.12 as Kirigami
import org.kde.plasma.components 3.0 as PlasmaComponents

Kirigami.FormLayout {
    property alias cfg_enableScrolling: enableScrollingCheckBox.checked
    property alias cfg_loopOver: loopOverCheckBox.checked

    Controls.CheckBox {
        id: enableScrollingCheckBox
        text: i18n("Enabled")
        Kirigami.FormData.label: i18n("Layout switching using a mouse wheel:")
        PlasmaComponents.ToolTip { text: i18n("Switch layouts by scrolling over the applet's icon") }
    }

    Controls.CheckBox {
        id: loopOverCheckBox
        text: i18n("Loop over")
        enabled: enableScrollingCheckBox.checked
        PlasmaComponents.ToolTip { text: i18n("Loop over when switching layouts") }
    }
}
