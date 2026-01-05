npx expo prebuild && cd android && ./gradlew assembleRelease && cd ..

# you may sometimes need to npx expo prebuild --clean && cd android && ./gradlew assembleRelease && cd ..
# to clean the build cache
# you have to revert the changes in:
# /android/app/dietiestates25.keystore
# /android/app/build.gradle
# /android/app/src/main/assets/index.android.bundle
# then run this again npx expo prebuild && cd android && ./gradlew assembleRelease && cd ..