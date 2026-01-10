import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginPage from './LoginPage';
import HomePage from './HomePage';
import DetectScan from './DetectScan';
import DetectCam from './DetectCam';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}} />
            <Stack.Screen name="Home" component={HomePage} options={{headerShown: false}} />
            <Stack.Screen name="DetectScan" component={DetectScan} options={{headerShown: false}} />
            <Stack.Screen name="DetectCam" component={DetectCam} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}