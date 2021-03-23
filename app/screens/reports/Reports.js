
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import UserGuest from '../account/UserGuest';
import * as firebase from 'firebase';

export default function Reports(props) {
    const [login, setLogin] = useState(true);
    const [reportAppendEntry, setReportAppendEntry] = useState(null);
    const { navigation, route } = props;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            !user ? setLogin(false) : setLogin(true);
        });
        
        const params = route.params;
        if (params) {
            if (params.type === 'Llegada' || params.type === 'Salida') setReportAppendEntry(params.uid)
        }
    }, [route.params])

    if (login === null) return <Loading isVisible={true} text='Cargando' />

    return login ? (
        <ScrollView
            centerContent={true}
            style={styles.viewBody}
        >
            <View style={styles.viewBtn}>
                <Button
                    title='Llegada'
                    titleStyle={styles.titleBtnStyle}
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('add-reports')}
                    icon={{
                        type: 'material-community',
                        name: "map-check-outline",
                        size: 40,
                        color: "white"
                    }}
                />
            </View>
            <View style={styles.viewBtn}>
                <Button
                    title='Salida'
                    titleStyle={styles.titleBtnStyle}
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('exit-reports')}
                    icon={{
                        type: 'material-community',
                        name: "map-outline",
                        size: 40,
                        color: "white"
                    }}
                />
            </View>
            <View style={styles.viewBtn}>
                <Button
                    title='Incapacidad'
                    titleStyle={styles.titleBtnStyle}
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('incapacity-reports')}
                    icon={{
                        type: 'material-community',
                        name: "flag-variant",
                        size: 40,
                        color: "white"
                    }}
                />
            </View>
        </ScrollView>
    ) : <UserGuest />;
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    viewBtn: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 80,
        marginTop: 50
    },
    btnStyle: {
        backgroundColor: '#2860A4',
        color: '#fff'
    },
    btnContainer: {
        width: '70%'
    },
    titleBtnStyle: {
        fontSize: 25,
        fontWeight: 'bold'
    }
})
