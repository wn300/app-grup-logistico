import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function ChangeMailForm(props) {
    const {
        email,
        setShowModal,
        setReloadUserInfo
    } = props;

    const onSubmit = () => {
        console.log('foormulario enviado');
        // setError(null);
        // if (!newDisplayName) {
        //     setError('El nombre no puede estar vacio.');
        // } else if (displayName === newDisplayName) {
        //     setError('El nombre no puede ser igual al actual.');
        // } else {
        //     setIsLoading(true);
        //     const update = {
        //         displayName: newDisplayName
        //     }
        //     firebase
        //         .auth()
        //         .currentUser
        //         .updateProfile(update)
        //         .then(() => {
        //             setIsLoading(false);
        //             setReloadUserInfo(true);
        //             setShowModal(false);
        //         })
        //         .catch(() => {
        //             setIsLoading(false)
        //             setError('Error al actualizar el nombre.')
        //         });
        // }
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder='Correo electronico'
                containerStyle={styles.input}
                rightIcon={{
                    type: 'material-community',
                    name: 'at',
                    color: '#c2c2c2'
                }}
                defaultValue={email && email}
            // onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
            // errorMessage={error}
            />
            <Input
                placeholder='Contraseña'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={true}
                rightIcon={{
                    type: 'material-community',
                    name: 'eye-outline',
                    color: '#c2c2c2'
                }}
            // onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
            // errorMessage={error}
            />
            <Button
                title='Cambiar nombre'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
            // loading={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: '95%'
    },
    btn: {
        backgroundColor: '#00a680'
    }
});
