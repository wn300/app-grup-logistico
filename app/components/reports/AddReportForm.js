import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button, Text } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { map, size, filter, orderBy, clone } from 'lodash'
import { useNetInfo } from "@react-native-community/netinfo";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import moment from "moment";
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

import Modal from '../Modal'
import { firebaseApp } from '../../utils/firebase';
import { log } from 'react-native-reanimated';

const db = firebase.firestore(firebaseApp);

const WidthScreen = Dimensions.get('window').width;

export default function AddReportForm(props) {
    const {
        toastRef,
        setLoading,
        setLoadingText,
        navigation,
        routeParams
    } = props;


    const route = useRoute();
    const typeReport = route.name === 'add-reports'
        ? 'Llegada'
        : route.name === 'exit-reports'
            ? 'Salida'
            : 'Incapacidad';
    const [valueType, setValueType] = useState(typeReport);
    const [valueDescription, setValueDescription] = useState('');
    const [valueAddres, setValueAddres] = useState('');
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationReport, setLocationReport] = useState(null);

    useEffect(() => {
        setLoading(true);
        setLoadingText('Cargando')
    }, [true])

    const addReport = (useNetInfo) => {
        if ((!valueAddres) && valueType === 'Salida') {
            toastRef.current.show('Todos los campos son obligatorios');
        } else if (!valueAddres && valueType !== 'Salida') {
            toastRef.current.show('Todos los campos son obligatorios');
        } else if (size(imagesSelected) === 0 && valueType === 'Incapacidad') {
            toastRef.current.show('La incapacidad debe tener almenos una foto');
        } else if (!valueDescription && valueType === 'Incapacidad') {
            toastRef.current.show('Todos los campos son obligatorios.');
        } else if (!locationReport) {
            toastRef.current.show('Tiene que guardar la localizacion en el mapa');
        } else {
            setLoading(true);
            setLoadingText('Creando reporte');
            uploadImageStorage()
                .then(response => {
                    const objectSave = {
                        type: valueType,
                        description: valueDescription,
                        address: valueAddres,
                        location: locationReport,
                        images: response,
                        status: valueType === 'Llegada' ? true : false,
                        date: new Date(),
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                        email: firebase.auth().currentUser.email
                    }
                    if (useNetInfo.isConnected) {
                        db.collection('reports')
                            .add(objectSave)
                            .then(async (resp) => {
                                // console.log(objectSave.date, moment(objectSave.date, 'DD/MM/YYYY', true).format());
                                const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                                const startDate = moment(onlyDateNow).toDate();
                                const endDate = moment(onlyDateNow).add(23, 'hours').add(59, 'minutes').add(59, 'seconds').toDate();

                                const people = await db.collection('people')
                                    .where('identification', '==', parseFloat(objectSave.email.split('@')[0]))
                                    .get()

                                let peopleArray = [];

                                people.forEach(doc => {
                                    peopleArray
                                        .push({
                                            id: doc.id,
                                            ...doc.data()
                                        })
                                });

                                const programing = await db.collection('programming')
                                    .where('date', '<=', endDate).where('date', '>=', startDate)
                                    .get()

                                let programingArray = [];

                                programing.forEach(doc => {
                                    programingArray
                                        .push({
                                            id: doc.id,
                                            ...doc.data()
                                        })
                                });

                                if (programingArray.length > 0 && peopleArray[0].position === 'Supernumerario') {

                                    const worksCenter = await db.collection('workCenter').get()

                                    let worksCenterArray = [];

                                    worksCenter.forEach(doc => {
                                        worksCenterArray
                                            .push({
                                                id: doc.id,
                                                ...doc.data()
                                            })
                                    });

                                    const programmingsByIdentification = programingArray.filter(filt => filt.identification === parseFloat(objectSave.email.split('@')[0]));
                                    if (objectSave.type === 'Llegada') {
                                        const arrayToDefine = [];
                                        programmingsByIdentification.forEach(programmingByIdentification => {
                                            if (programmingByIdentification.reportStart === undefined) {
                                                const workCenter = worksCenterArray.filter(filt => filt.operationCode === programmingByIdentification.operationCode)[0];
                                                const x1 = workCenter.latitude;
                                                const y1 = workCenter.longitude;
                                                const x2 = objectSave.location.latitude;
                                                const y2 = objectSave.location.longitude;

                                                const km = getKilometros(x1, y1, x2, y2);

                                                let position = 'Fuera de rango';
                                                if ((parseFloat(km) * 1000) <= 300) {
                                                    position = 'Dentro del rango';
                                                }

                                                objectSave.location.message = position;

                                                const diffTime = diffHours(programmingByIdentification.date.toDate(), objectSave.date, objectSave.type);
                                                const newObject = {
                                                    diffTime: parseFloat(`${diffTime[0]}${diffTime[1]}`),
                                                    ...programmingByIdentification,
                                                    reportStart: {
                                                        data: {
                                                            ...objectSave,
                                                            message: diffTime[0] === 0 && diffTime[1] <= 15 ? 'A tiempo' : 'Fuera de rango'
                                                        },
                                                        id: resp.id
                                                    },
                                                    reportEnd: {
                                                        data: {
                                                            type: '',
                                                            description: '',
                                                            address: '',
                                                            location: {},
                                                            images: [],
                                                            status: '',
                                                            date: '',
                                                            createAt: '',
                                                            createBy: '',
                                                            email: '',
                                                            message: ''
                                                        },
                                                        id: ''
                                                    }
                                                }

                                                arrayToDefine.push(newObject)
                                            }
                                        })

                                        if (arrayToDefine.length > 0) {
                                            const programmingReportSave = clone(orderBy(arrayToDefine, ['diffTime'], ['asc'])[0]);
                                            const resAddProgrammingReport = await db.collection('reportProgramming').add(programmingReportSave);

                                            const programmingUpdate = {
                                                applicantIdentification: programmingReportSave.applicantIdentification,
                                                applicantName: programmingReportSave.applicantName,
                                                date: programmingReportSave.date,
                                                identification: programmingReportSave.identification,
                                                name: programmingReportSave.name,
                                                observation: programmingReportSave.observation,
                                                operationCode: programmingReportSave.operationCode,
                                                operationName: programmingReportSave.operationName,
                                                transport: programmingReportSave.transport,
                                                workplaceCode: programmingReportSave.workplaceCode,
                                                workplaceName: programmingReportSave.workplaceName,
                                                reportStart: resp.id,
                                                programmingReport: resAddProgrammingReport.id,
                                            }

                                            await db.collection('programming').doc(programmingReportSave.id).update(programmingUpdate);
                                        }
                                    }
                                    if (objectSave.type === 'Salida') {
                                        // console.log(programmingsByIdentification, '3');
                                    }
                                }

                                setLoading(false);
                                navigation.navigate('reports', {
                                    type: valueType,
                                    uid: valueType === 'Salida' ? null : 'Inicio  de proceso',
                                });
                            })
                        // .catch(() => {
                        //     setLoading(false);
                        //     toastRef.current.show('Error al crear el reporte');
                        // })
                    } else {
                        db.collection('reports')
                            .add(objectSave).then((resp) => {
                                Alert.alert('Un reporte se guardo exitosamente.')
                            })
                            .catch(() => {
                                Alert.alert('Error al guardar reporte.')
                            });

                        setLoading(false);
                        navigation.navigate('reports', {
                            type: valueType,
                            uid: valueType === 'Salida' ? null : 'Inicio  de proceso',
                        });
                    }

                })
        }
    };

    const uploadImageStorage = async () => {
        const imageBlob = []

        await Promise.all(
            map(imagesSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref('reports').child(uuid());

                await ref.put(blob).then(async result => {
                    await firebase
                        .storage()
                        .ref(`reports/${result.metadata.name}`)
                        .getDownloadURL()
                        .then(photoURL => {
                            imageBlob.push(photoURL);
                        });
                });
            })
        )

        return imageBlob;
    };
    const netInfo = useNetInfo();
    return (

        <ScrollView style={styles.ScrollView}>
            {valueType === 'Incapacidad' && <ImageReport
                imageReport={imagesSelected[0]}
            />}
            <FormAdd
                valueType={valueType}
                valueAddres={valueAddres}
                setValueType={setValueType}
                setValueDescription={setValueDescription}
                setIsVisibleMap={setIsVisibleMap}
            />
            {valueType === 'Incapacidad' && <UploadImages
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />}
            {(locationReport && netInfo.isConnected) && (
                <View style={styles.viewMap}>
                    <GoogleMapView
                        location={locationReport}
                        whereView='form'
                    />
                </View>
            )}
            <Button
                title='Enviar'
                onPress={() => addReport(netInfo)}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map
                toastRef={toastRef}
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationReport={setLocationReport}
                setValueAddres={setValueAddres}
                setLoading={setLoading}
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
        valueType,
        valueAddres,
        setValueType,
        setValueDescription,
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
            <Input
                placeholder='Dirección'
                inputContainerStyle={styles.input}
                value={valueAddres}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='google-maps'
                        color={valueAddres ? '#2860A4' : '#c2c2c2'}
                        onPress={() => setIsVisibleMap(true)}
                    />
                }
            />
        </View>
    )
}

function Map(props) {
    const {
        toastRef,
        isVisibleMap,
        setIsVisibleMap,
        setLocationReport,
        setValueAddres,
        setLoading
    } = props;
    const [location, setLocation] = useState(null)

    const netInfo = useNetInfo();

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
                const locationCurrent = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: locationCurrent.coords.latitude,
                    longitude: locationCurrent.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
                const addres = netInfo.isConnected ? await Location.reverseGeocodeAsync(
                    {
                        latitude: locationCurrent.coords.latitude,
                        longitude: locationCurrent.coords.longitude,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001
                    }
                ) : false;

                const addresString = addres ? `${addres[0].street}, ${addres[0].name}, ${addres[0].city}, ${addres[0].district}, ${addres[0].country}` : 'Modo offline no detecta dirección';
                await setValueAddres(addresString);
                await setLocationReport({
                    latitude: locationCurrent.coords.latitude,
                    longitude: locationCurrent.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                });

                setLoading(false);
            }
        })()
    }, [netInfo.isConnected])

    return (
        <Modal
            isVisible={isVisibleMap}
            setIsVisible={setIsVisibleMap}
        >
            <View>
                {(location && netInfo.isConnected) && (
                    <GoogleMapView
                        location={location}
                        whereView='modal'
                    />
                )}
                <View style={styles.mapBtn}>
                    <Button
                        title='Cerrar mapa'
                        containerStyle={styles.viewBtnMapSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function GoogleMapView(props) {
    const { location, whereView } = props;
    return (
        <MapView
            style={whereView === 'modal' ? styles.mapStyleModal : styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
        >
            <MapView.Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
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
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })

            // const result = await ImagePicker.launchImageLibraryAsync({
            //     allowsEditing: true,
            //     aspect: [4, 3]
            // })

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

function diffHours(startDate, endDate, type) {
    const startTime = moment(startDate, 'HH:mm:ss');
    const endTime = moment(endDate, 'HH:mm:ss');

    let hours = 0;
    let minutes = '';
    // calculate total duration
    if (type !== 'Salida') {
        if (startDate < endDate) {
            hours = endTime.diff(startTime, 'hours');
            minutes = moment.utc(endTime.diff(startTime)).format('mm');
        } else {
            hours = startTime.diff(endTime, 'hours');
            minutes = moment.utc(startTime.diff(endTime)).format('mm');
        }
    } else {
        hours = endTime.diff(startTime, 'hours');
        minutes = moment.utc(endTime.diff(startTime)).format('mm');
    }

    return [hours, minutes];
}

function getKilometros(lat1, lon1, lat2, lon2) {
    const rad = (x) => x * Math.PI / 180;
    // Radio de la tierra en km
    const R = 6378.137;
    const dLat = rad(lat2 - lat1);
    const dLong = rad(lon2 - lon1);
    // tslint:disable-next-line:max-line-length
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(3);
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
    btnAddRestaurant: {
        backgroundColor: '#2860A4',
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
    },
    mapStyle: {
        width: '100%',
        height: '100%'
    },
    mapStyleModal: {
        width: '100%',
        height: 550
    },
    mapBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    viewBtnMapSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: '#2860A4',
        width: '100%'
    },
    viewMap: {
        alignItems: 'center',
        height: 200,
        marginBottom: 10,
        marginTop: 10
    }
});