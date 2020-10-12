import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements'
import * as firebase from 'firebase'
import * as Permissions from 'expo-permissions'
import * as ImagPicker from 'expo-image-picker'

export default function InfoUser(props) {
    const {
        userInfo: { uid, photoURL, displayName, email },
        toastRef,
        setLoading,
        setLoadingText
    } = props;

    const changeAvatar = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionsCamera = resultPermissions.permissions.cameraRoll.status;

        if (resultPermissionsCamera === 'denied') {
            toastRef.current.show('Es necesario aceptar los permisos de la galeria.');
        } else {
            const result = await ImagPicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })

            if (result.cancelled) {
                toastRef.current.show('Has cerrado la seleccion de imagenes.')
            } else {
                setLoadingText('Actualizado avatar');
                setLoading(true);
                uploadAvatar(result.uri)
                    .then(response => {
                        updateAvatarUrl();
                    })
                    .catch(error => {
                        toastRef.current.show('Error al subir el avatar.')
                    });
            }
        }
    }

    const uploadAvatar = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
       
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }

    const updateAvatarUrl = () => {
        firebase
            .storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async (response) => {
                const update = {
                    photoURL: response
                }

                await firebase
                    .auth()
                    .currentUser
                    .updateProfile(update)

                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                console.log(error);
                toastRef.current.show('Error al actualizar el avatar.')
            })
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size='large'
                source={
                    photoURL
                        ? { uri: photoURL }
                        : require('../../../assets/avatar-default.jpg')
                }
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : 'Anónimo'}
                </Text>
                <Text>
                    {email ? email : 'Anónimo'}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: 'bold',
        paddingBottom: 10
    }
});
