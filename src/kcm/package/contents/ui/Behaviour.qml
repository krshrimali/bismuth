// SPDX-FileCopyrightText: 2021 Mikhail Zolotukhin <mail@gikari.com>
// SPDX-License-Identifier: MIT

import "./components" as BIC
import "./views" as BIView
import QtQuick 2.12
import QtQuick.Controls 2.12 as QQC2
import QtQuick.Layouts 1.15
import org.kde.kcm 1.5 as KCM
import org.kde.kirigami 2.7 as Kirigami

Kirigami.FormLayout {
    id: behaviorTab

    Item {
        Kirigami.FormData.isSection: true
        Kirigami.FormData.label: i18n("General")
    }

    BIC.ConfigCheckBox {
        settingName: "bismuthEnabled"
        text: i18n("Enable window tiling")
    }

    Item {
        Kirigami.FormData.isSection: true
        Kirigami.FormData.label: i18n("Layouts")
    }

    BIC.ConfigCheckBox {
        Kirigami.FormData.label: i18n("Separate layouts for each:")
        text: i18n("Activity")
        settingName: "layoutPerActivity"
    }

    BIC.ConfigCheckBox {
        text: i18n("Virtual Desktop")
        settingName: "layoutPerDesktop"
    }

    QQC2.Button {
        id: configureLayoutsButton

        icon.name: "document-edit"
        text: i18n("Customize Layouts...")
        onClicked: () => {
            return kcm.push("./views/Layouts.qml");
        }
    }

    Item {
        Kirigami.FormData.isSection: true
        Kirigami.FormData.label: i18n("Windows")
    }

    BIC.ConfigCheckBox {
        text: i18n("Maximize sole window")
        settingName: "maximizeSoleTile"
    }

    BIC.ConfigCheckBox {
        text: i18n("Untile windows by dragging")
        settingName: "untileByDragging"
    }

    BIC.ConfigCheckBox {
        text: i18n("Floating windows always on top")
        settingName: "keepFloatAbove"
    }

    BIC.ConfigCheckBox {
        text: i18n("Allow movement across screen boundries")
        settingName: "moveBetweenSurfaces"
    }

    QQC2.ButtonGroup {
        id: windowSpawnPositionGroup
    }

    QQC2.RadioButton {
        Kirigami.FormData.label: i18n("New windows spawn:")
        text: i18n("At the master area")
        QQC2.ButtonGroup.group: windowSpawnPositionGroup
        checked: kcm.config.newWindowSpawnLocation == "master"
        onClicked: kcm.config.newWindowSpawnLocation = "master"

        KCM.SettingStateBinding {
            configObject: kcm.config
            settingName: "newWindowSpawnLocation"
        }
    }

    QQC2.RadioButton {
        text: i18n("At the active window")
        QQC2.ButtonGroup.group: windowSpawnPositionGroup
        checked: kcm.config.newWindowSpawnLocation == "beforeFocused"
        onClicked: kcm.config.newWindowSpawnLocation = "beforeFocused"

        KCM.SettingStateBinding {
            configObject: kcm.config
            settingName: "newWindowSpawnLocation"
        }
    }

    QQC2.RadioButton {
        text: i18n("After the active window")
        QQC2.ButtonGroup.group: windowSpawnPositionGroup
        checked: kcm.config.newWindowSpawnLocation == "afterFocused"
        onClicked: kcm.config.newWindowSpawnLocation = "afterFocused"

        KCM.SettingStateBinding {
            configObject: kcm.config
            settingName: "newWindowSpawnLocation"
        }
    }

    QQC2.RadioButton {
        text: i18n("At the layout's end")
        QQC2.ButtonGroup.group: windowSpawnPositionGroup
        checked: kcm.config.newWindowSpawnLocation == "end"
        onClicked: kcm.config.newWindowSpawnLocation = "end"

        KCM.SettingStateBinding {
            configObject: kcm.config
            settingName: "newWindowSpawnLocation"
        }
    }

    QQC2.RadioButton {
        text: i18n("Floating")
        QQC2.ButtonGroup.group: windowSpawnPositionGroup
        checked: kcm.config.newWindowSpawnLocation == "floating"
        onClicked: kcm.config.newWindowSpawnLocation = "floating"

        KCM.SettingStateBinding {
            configObject: kcm.config
            settingName: "newWindowSpawnLocation"
        }
    }

    QQC2.ButtonGroup {
        id: mouseDragBehaviorGroup
    }

    QQC2.RadioButton {
        Kirigami.FormData.label: i18n("Windows moved by mouse:")
        text: i18n("Swap with target window")
        QQC2.ButtonGroup.group: mouseDragBehaviorGroup
        checked: !kcm.config.mouseDragInsert
        onClicked: kcm.config.mouseDragInsert = !checked

        KCM.SettingStateBinding {
            configObject: kcm.config
            settingName: "mouseDragInsert"
        }
    }

    QQC2.RadioButton {
        text: i18n("Insert at target window")
        QQC2.ButtonGroup.group: mouseDragBehaviorGroup
        checked: kcm.config.mouseDragInsert
        onClicked: kcm.config.mouseDragInsert = checked

        KCM.SettingStateBinding {
            configObject: kcm.config
            settingName: "mouseDragInsert"
        }
    }

    QQC2.Button {
        id: windowRules

        icon.name: "document-edit"
        text: i18n("Window Rules...")
        onClicked: () => {
            return kcm.push("./views/WindowRules.qml");
        }
    }

    Item {
        Kirigami.FormData.isSection: true
        Kirigami.FormData.label: i18n("Restrictions")
    }

    BIC.ConfigCheckBox {
        id: restrictWidth

        text: i18n("Restrict window width")
        settingName: "limitTileWidth"
    }

    BIC.RatioConfigSpinBox {
        Kirigami.FormData.label: i18n("Window Width/Screen Height ratio:")
        settingName: "limitTileWidthRatio"

        // For some reason we cannot pass a custom property to
        // extraEnabledConditions, so we have to define it here.
        // It is also a reason why RatioConfigSpinBox uses
        // QQC2.SpinBox instead of ConfigSPinBox component
        KCM.SettingStateBinding {
            configObject: kcm.config
            settingName: "limitTileWidthRatio"
            extraEnabledConditions: restrictWidth.checked
        }

    }

    BIC.ConfigCheckBox {
        text: i18n("Prevent window minimization")
        settingName: "preventMinimize"
    }

    BIC.ConfigCheckBox {
        text: i18n("Prevent window from protruding from its screen")
        settingName: "preventProtrusion"
    }

    QQC2.Button {
        id: workspaceRules

        icon.name: "document-edit"
        text: i18n("Workspace Rules...")
        onClicked: () => {
            return kcm.push("./views/WorkspaceRules.qml");
        }
    }

}
