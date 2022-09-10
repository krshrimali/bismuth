/*
 * SPDX-FileCopyrightText: 2021 Ignacy Kajdan <git@verahawk.com>
 * SPDX-License-Identifier: MIT
 */

#ifndef BISMUTH_H
#define BISMUTH_H

#include <Plasma/Applet>

class bismuth : public Plasma::Applet
{
    Q_OBJECT

public:
    bismuth(QObject *parent, const QVariantList &args);
};

#endif // BISMUTH_H
