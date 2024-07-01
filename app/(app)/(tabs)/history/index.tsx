import React, {useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import {Services} from "@/services/Services";


const History: React.FC = () => {
    const [transactions, setTransactions]:any = React.useState();
    useEffect(()=>{
        const services =new Services()
        const data=services.GetResource("data/tx/pk/36e176ad58fad39b0b0deec73f80337945b1ec94482321c4c7fa914e69e670f8")
        data.then(res=>setTransactions(res.items))
        data.then(res=>console.log(res))
    },[])

    return (
        <ScrollView style={styles.container}>
            {transactions ? (<View>
                {transactions.map((transaction:any,key:number) => (
                <View key={key} style={styles.transactionContainer}>
                    <View style={styles.transactionDetail}>
                        <Text style={styles.transactionTextBold}>{transaction.id}</Text>
                        <Text style={styles.transactionText}>{transaction.timestamp}</Text>
                    </View>
                    <View style={styles.transactionDetail}>
                        <Text style={styles.transactionText}>From: {transaction.sender}</Text>
                        <Text style={styles.transactionText}>Type: {transaction.type}</Text>
                    </View>
                </View>
            ))}</View>):(<Text>loading...</Text>)}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    transactionContainer: {
        backgroundColor: '#f7f7f7',
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 5,
        elevation: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionDetail: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    transactionText: {
        fontSize: 16,
        color: '#333',
    },
    transactionTextBold: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default History;
