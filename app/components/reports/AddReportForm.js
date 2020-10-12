import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button, Text } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { map, size, filter } from 'lodash'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import Modal from '../Modal'

const WidthScreen = Dimensions.get('window').width;

export default function AddReportForm(props) {
    const {
        toastRef,
        setIsLoading,
        navigation
    } = props;


    const route = useRoute();
    const typeReport = route.name === 'add-reports'
        ? 'Llegada'
        : route.name === 'exit-reports'
            ? 'Salida'
            : 'Incapacidad';
    const [valueType, setValueType] = useState(typeReport);
    const [valueDescription, setValueDescription] = useState('');
    const [valueTransport, setValueTransport] = useState('');
    const [valueAddres, setValueAddres] = useState('');
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);


    const addRestaurant = () => {
        console.log(imagesSelected);
        console.log('ok');
    }

    return (
        <ScrollView style={styles.ScrollView}>
            <ImageReport
                imageReport={imagesSelected[0]}
            />
            <FormAdd
                valueType={valueType}
                setValueType={setValueType}
                setValueDescription={setValueDescription}
                setValueTransport={setValueTransport}
                setIsVisibleMap={setIsVisibleMap}
            />
            <UploadImages
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title='Crear reporte'
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map
                toastRef={toastRef}
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
            />
        </ScrollView>
    )
}

function ImageReport(props) {
    const { imageReport } = props;

    return (
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imageReport ? { uri: imageReport }
                        : require('../../../assets/no-image.png')
                }
                style={{ width: WidthScreen, height: 200 }}
            />
        </View>
    )
}

function FormAdd(props) {
    const {
        setValueType,
        setValueDescription,
        setValueTransport,
        valueType,
        setIsVisibleMap
    } = props;

    return (
        <View style={styles.viewForm}>
            <Text
                style={styles.textTitle}
            >Tipo</Text>
            <Input
                placeholder='Ingrese valor de transporte'
                inputContainerStyle={styles.input}
                disabled={true}
                value={valueType}
                onChange={e => setValueType(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='menu-down'
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Text
                style={styles.textTitle}
            >Descripción</Text>
            <Input
                placeholder='Ingrese una descripcion'
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setValueDescription(e.nativeEvent.text)}
            />
            <Text
                style={styles.textTitle}
            >Transporte</Text>
            <Input
                placeholder='Ingrese valor de transporte'
                inputContainerStyle={styles.input}
                keyboardType='numeric'
                onChange={e => setValueTransport(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='currency-usd'
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder='Dirección'
                inputContainerStyle={styles.input}
                onChange={e => setValueAddrest(e.nativeEvent.text)}
                disabled
                rightIcon={
                    <Icon
                        type='material-community'
                        name='google-maps'
                        iconStyle={styles.iconRight}
                        onPress={() => setIsVisibleMap(true)}
                    />
                }
            />
        </View>
    )
}

function Map(props) {
    const { toastRef, isVisibleMap, setIsVisibleMap } = props;
    const [location, setLocation] = useState(null)

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            )

            const statusPermission = resultPermissions.permissions.location.status;

            if (statusPermission !== 'granted') {
                toastRef.current.show(
                    'Es necesario aceptar los permisos de localización, para crear el reporte.',
                    3000
                );
            } else {
                const location = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    return (
        <Modal
            isVisible={isVisibleMap}
            setIsVisible={setIsVisibleMap}
        >
            <Text>Mapa</Text>
        </Modal>
    )
}

function UploadImages(props) {
    const { toastRef, imagesSelected, setImagesSelected } = props;

    const imageSelect = async () => {
        const resultPermisions = await Permissions.askAsync(Permissions.CAMERA);

        if (resultPermisions === 'denied') {
            toastRef.current.show(
                'Es necesario aceptar los permisos de galeria, acepte en las configuraciones de su dispositivo',
                3000
            );
        } else {
            // const result = await ImagePicker.launchCameraAsync({
            //     allowsEditing: true,
            //     aspect: [4, 3]
            // })

            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })

            if (result.cancelled) {
                toastRef.current.show(
                    'Has cerado la galeria sin seleccionar imagen',
                    2000
                );
            } else {
                setImagesSelected([...imagesSelected, result.uri]);
            }
        }
    }

    const removeImage = (image) => {
        const arrayImages = imagesSelected;

        Alert.alert(
            'Eliminar imagen',
            '¿Estas seguro de que quieres elimnar la imagen?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        const resultFilter = filter(arrayImages, (imageUrl) => imageUrl !== image);
                        setImagesSelected(resultFilter)
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <View style={styles.viewImages}>
            {size(imagesSelected) < 4 && (
                <Icon
                    type='material-community'
                    name='camera'
                    color='#7a7a7a'
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imagesSelected, (imageReport, index) => (
                <Avatar
                    key={index}
                    style={styles.minietuStyles}
                    source={{ uri: imageReport }}
                    onPress={() => removeImage(imageReport)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: '100%',
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        height: 100,
        width: '100%'
    },
    textTitle: {
        marginLeft: 10,
        marginTop: 10,
        fontSize: 17,
        fontWeight: 'bold'
    },
    iconRight: {
        color: '#c1c1c1'
    },
    btnAddRestaurant: {
        backgroundColor: '#00a680',
        margin: 20
    },
    viewImages: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: '#e3e3e3'
    },
    minietuStyles: {
        marginRight: 10,
        height: 70,
        width: 70,
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    }
});
