import { AppRegistry } from 'react-native';
import App from './src/App';
import CodePush from "react-native-code-push";
import crashlytics from 'react-native-fabric-crashlytics';

let codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: CodePush.InstallMode.ON_NEXT_RESUME
};

crashlytics.init();

AppRegistry.registerComponent('GoodApp', () => CodePush(codePushOptions)(App));
