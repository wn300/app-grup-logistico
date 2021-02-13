import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import * as firebase from 'firebase';

import Loading from '../../components/Loading';
import InfoUser from '../../components/account/InfoUser';
import AccountOptions from '../../components/account/AccountOptions';

export default function UserLogged() {
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [reloadUserInfo, setReloadUserInfo] = useState(false)
    const toastRef = useRef();

    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })()
    }, [reloadUserInfo])

    return (
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser
                userInfo={userInfo}
                toastRef={toastRef}
                setLoading={setLoading}
                setLoadingText={setLoadingText}
            />}

            <Button
                title='Cerrar sesion'
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <Loading isVisible={loading} text={loadingText} />
        </View>
    )
}


const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: '100%',
        backgroundColor: '#f2f2f2'
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingTop: 10,
        paddingBottom: 10
    },
    btnCloseSessionText: {
        color: '#2860A4'
    }
});