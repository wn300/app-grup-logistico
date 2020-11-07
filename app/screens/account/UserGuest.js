import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function UserGuest() {
    const navigation = useNavigation();

    return (
        <ScrollView
            centerContent={true}
            style={styles.viewBody}
        >
            <Image
                source={require('../../../assets/aplicacion-movil.png')}
                resizeMode='contain'
                style={styles.image}
            />
            <Text style={styles.title}>
                Consulta tu perfil
            </Text>
            <Text style={styles.description}>
                Inicia sesion para ver tu perfil
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    title='Ver perfil'
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('login')}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image: {
        height: 300,
        width: '100%',
        marginBottom: 40
    },
    title: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        textAlign: 'center',
        marginBottom: 20
    },
    viewBtn: {
        flex: 1,
        alignItems: 'center'
    },
    btnStyle: {
        backgroundColor: '#2860A4'
    },
    btnContainer: {
        width: '70%'
    }
});
