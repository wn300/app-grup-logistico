import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { size, isEmpty } from 'lodash';
import * as firebase from 'firebase'
import { useNavigation } from '@react-navigation/native';

import { validateEmail } from '../../utils/validations';
import Loading from '../../components/Loading'

export default function RegisterForm(props) {
    const { toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const onSubmit = () => {
        if (
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.passwordConfirm)
        ) {
            toastRef.current.show('Todos los campos son obligatrios.')
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show('El email no es correcto.')
        } else if (formData.password !== formData.passwordConfirm) {
            toastRef.current.show('Las contrasaeñas tienen que ser iguales.')
        } else if (size(formData.password) < 6) {
            toastRef.current.show('La contrasaeña tienen que ser superior a es caracteres.')
        }
        else {
            setLoading(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then(response => {
                    setLoading(false);
                    navigation.navigate('account');
                })
                .catch(error => {
                    setLoading(false);
                    toastRef.current.show('El email ya esta e uso, pruebe con otro.');
                })
        }
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder='Correo electronico'
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, 'email')}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='at'
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder='Contraseña'
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={e => onChange(e, 'password')}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder='Confirmar contraseña'
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPasswordConfirm ? false : true}
                onChange={e => onChange(e, 'passwordConfirm')}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPasswordConfirm ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    />
                }
            />
            <Button
                title='Registrarse'
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={() => onSubmit()}
            />
            <Loading isVisible={loading} text='Creando cuenta' />
        </View>
    )
}

function defaultFormValue() {
    return {
        email: '',
        password: '',
        passwordConfirm: ''
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    inputForm: {
        width: '100%',
        marginTop: 20
    },
    btnContainerRegister: {
        marginTop: 20,
        width: '95%'
    },
    btnRegister: {
        backgroundColor: '#00a680'
    },
    iconRight: {
        color: '#c1c1c1'
    }
});
