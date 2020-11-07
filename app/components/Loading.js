import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Overlay } from 'react-native-elements'

export default function Loading(props) {
    const { isVisible, text } = props;

    return (
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor='rgba(0, 0, 0, 0.5)'
            overlayBackgroundColor='transparent'
            overlayStyle={styles.overlay}
        >
            <View style={styles.view}>
                <ActivityIndicator size="large" color="#2860A4" />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
        height: 100,
        width: 200,
        backgroundColor: '#fff',
        borderColor: '#2860A4',
        borderWidth: 2,
        borderRadius: 10
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#2860A4',
        textTransform: 'uppercase',
        marginTop: 10
    }
});
