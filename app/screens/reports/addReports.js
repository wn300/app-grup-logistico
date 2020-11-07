import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddReportForm from '../../components/reports/AddReportForm';

export default function addReports(props) {
    const { navigation, route } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const toastRef = useRef();
    
    return (
        <View>
            <AddReportForm
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
                setLoading={setLoading}
                setLoadingText={setLoadingText}
                routeParams={route}
            />
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <Loading isVisible={loading} text={loadingText} />
        </View>
    )
}

const styles = StyleSheet.create({})

