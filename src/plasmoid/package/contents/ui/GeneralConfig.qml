/*
 * SPDX-FileCopyrightText: 2021 Ignacy Kajdan <git@verahawk.com>
 * SPDX-License-Identifier: MIT
 */

import QtQuick 2.15
import QtQuick.Controls 2.15 as Controls
import org.kde.kirigami 2.12 as Kirigami

Kirigami.FormLayout {
    property alias cfg_enableScrolling: enableScrollingCheckBox.checked
    property alias cfg_loopOver: loopOverCheckBox.checked

    Controls.CheckBox {
        id: enableScrollingCheckBox
        text: i18n("Enabled")
        Kirigami.FormData.label: i18n("Layout switching using a mouse wheel:")
        Controls.ToolTip.visible: hovered  // TODO: Any way to use "native" tooltip here?
        Controls.ToolTip.delay: 1500
        Controls.ToolTip.text: i18n("Switch layouts by scrolling over the applet's icon")
    }

    Controls.CheckBox {
        id: loopOverCheckBox
        text: i18n("Loop over")
        enabled: enableScrollingCheckBox.checked
        Controls.ToolTip.visible: hovered  // TODO: Any way to use "native" tooltip here?
        Controls.ToolTip.delay: 1500
        Controls.ToolTip.text: i18n("Loop over when switching layouts")
    }
}
