import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddReportForm from '../../components/reports/AddReportForm';

export default function addReports(props) {
    const { navigation } = props;
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    return (
        <View>
            <AddReportForm
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
            />
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <Loading isVisible={isLoading} text='Creando reporte' />
        </View>
    )
}

const styles = StyleSheet.create({})

