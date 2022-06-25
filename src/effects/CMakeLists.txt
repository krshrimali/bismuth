# KI18N Translation Domain for this library
add_definitions(-DTRANSLATION_DOMAIN=\"kwin_effects\" -DEFFECT_BUILTINS)

include_directories(${KWin_SOURCE_DIR}/src) # for xcbutils.h

# add_subdirectory(private)


function(kwin_add_effect_config name)
    list(REMOVE_ITEM ARGV ${name})
    kcoreaddons_add_plugin(${name} INSTALL_NAMESPACE "kwin/effects/configs" SOURCES ${ARGV})
endfunction()

# Add a CMake-time check for python3 to avoid failures during build.
find_package (Python3 COMPONENTS Interpreter)
add_feature_info("Python3" Python3_Interpreter_FOUND "Required to strip effects metadata")
set(KSEM_EXE "${CMAKE_CURRENT_SOURCE_DIR}/strip-effect-metadata.py")

function (kwin_strip_builtin_effect_metadata target metadata)
    set(stripped_metadata "${CMAKE_CURRENT_BINARY_DIR}/${metadata}.stripped")

    set(command ${KSEM_EXE} --source=${metadata} --output=${stripped_metadata})
    add_custom_command(
        OUTPUT ${stripped_metadata}
        COMMAND ${command}
        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
        DEPENDS ${metadata}
        COMMENT "Stripping ${metadata}..."
    )
    set_property(TARGET ${target} APPEND PROPERTY AUTOGEN_TARGET_DEPENDS ${stripped_metadata})
endfunction()

macro(KWIN4_ADD_EFFECT_MODULE name)
    kcoreaddons_add_plugin(${name} STATIC SOURCES ${ARGN} INSTALL_NAMESPACE "kwin/effects/plugins")
    kwin_strip_builtin_effect_metadata(${name} metadata.json)
    install(FILES metadata.json DESTINATION ${KDE_INSTALL_DATADIR}/${KWIN_NAME}/builtin-effects/${name}/)
endmacro()

# Install the KWin/Effect service type
install(FILES kwineffect.desktop DESTINATION ${KDE_INSTALL_KSERVICETYPESDIR})

# scripted effects
function(install_scripted_effect name)
    kpackage_install_package(${name}/package kwin4_effect_${name} effects kwin)

    # necessary so tests are found without installing
    file(COPY ${name}/package/contents ${name}/package/metadata.desktop DESTINATION ${CMAKE_BINARY_DIR}/bin/kwin/effects/kwin4_effect_${name})
endfunction()

install_scripted_effect(tiled)
