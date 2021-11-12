/*
 * SPDX-FileCopyrightText: 2021 Ignacy Kajdan <git@verahawk.com>
 * SPDX-License-Identifier: MIT
 */

#include "bismuth.h"
// #include <KLocalizedString>

bismuth::bismuth(QObject *parent, const QVariantList &args) : Plasma::Applet(parent, args)
{
}

K_EXPORT_PLASMA_APPLET_WITH_JSON(bismuth, bismuth, "metadata.json")

#include "bismuth.moc"
