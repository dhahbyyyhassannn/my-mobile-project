import { View, StyleSheet } from 'react-native'


export default function LoadingScreen() {
    return (
        <View style={styles.screen}>
            <LottieView
                source={require('../../../assets/loading.json')}
                autoPlay
                loop
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    }
})