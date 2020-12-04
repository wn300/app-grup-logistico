import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { size, isEmpty } from 'lodash';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

import { validateNumber } from '../../utils/validations';
import Loading from '../../components/Loading';


export default function LoginForm(props) {
    const { toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const onSubmit = () => {
        if (
            isEmpty(formData.email) ||
            isEmpty(formData.password)
        ) {
            toastRef.current.show('Todos los campos son obligatrios.')
        } else if (!validateNumber(formData.email)) {
            toastRef.current.show('El email no es correcto.')
        } else if (size(formData.password) < 6) {
            toastRef.current.show('La contrasaeña tienen que ser superior a es caracteres.')
        }
        else {
            setLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(`${formData.email}@whatever.com`, formData.password)
                .then(resul => {
                    setLoading(false);
                    navigation.navigate('reports');
                })
                .catch(error => {
                    setLoading(false);
                    console.log(error);
                    toastRef.current.show('El email o contraseña incorrecta.');
                })
           
        }
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder='Identificación'
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, 'email')}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='account'
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
            <Button
                title='Iniciar sesión'
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={() => onSubmit()}
            />
            <Loading isVisible={loading} text='Inicindo sesión' />
        </View>
    )
}

function defaultFormValue() {
    return {
        email: '',
        password: ''
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
    btnContainerLogin: {
        marginTop: 20,
        width: '95%'
    },
    btnLogin: {
        backgroundColor: '#2860A4'
    },
    iconRight: {
        color: '#c1c1c1'
    }
});
