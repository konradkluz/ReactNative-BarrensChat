package com.believeapps.barrens;

import android.app.Application;

import com.believeapps.barrens.BuildConfig;
import com.crashlytics.android.Crashlytics;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.microsoft.codepush.react.CodePush;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.imagepicker.ImagePickerPackage;
import com.smixx.fabric.FabricPackage;

import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.fabric.sdk.android.Fabric;

import com.airbnb.android.react.maps.MapsPackage;


import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }


        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new FabricPackage(),
                    new MainReactPackage(),
                    new FIRMessagingPackage(),
                    new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
                    new RNBackgroundGeolocation(),
                    new RNFetchBlobPackage(),
                    new ImagePickerPackage(),
                    new ReactNativeI18n(),
                    new RNGoogleSigninPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new MapsPackage(),
                    new AndroidKeyboardAdjustPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        FacebookSdk.sdkInitialize(getApplicationContext());
        Fabric.with(this, new Crashlytics());
    }
}
