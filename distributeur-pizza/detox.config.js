/** @type {Detox.DetoxConfig} */
module.exports = {
    testRunner: {
        runner: 'jest',
        args: {
            setupTimeout: 120000
        },
        jest: {
            setupTimeout: 120000
        }
    },
    configurations: {
        "android.emu.debug": {
            device: {
                avdName: "Pixel_3a_API_34_extension_level_7_x86_64" // Remplacez par le nom de votre AVD Android
            },
            app: {
                binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
                build: 'cd android && gradlew.bat assembleDebug assembleAndroidTest -DtestBuildType=debug',
                type: "android.apk",
            }
        }
    }
};
