# SPDX-FileCopyrightText: 2021 Ignacy Kajdan <git@verahawk.com>
# SPDX-License-Identifier: MIT

project(bismuth-plasmoid)

# TODO: Set the applet version according to the CMAKE_PROJECT_VERSION
#file(COPY package DESTINATION "${CMAKE_CURRENT_BINARY_DIR}")
#configure_file("metadata.desktop.in" "package/metadata.desktop" @ONLY)

add_library(applet_bismuth MODULE)

target_link_libraries(
  applet_bismuth
  PRIVATE
  KF5::Plasma
  KF5::I18n
)

install(TARGETS applet_bismuth DESTINATION ${KDE_INSTALL_PLUGINDIR}/plasma/applets)

#kcoreaddons_desktop_to_json(applet_bismuth "package/metadata.desktop")
plasma_install_package(package org.kde.plasma.bismuth)

add_subdirectory(icons)
