import { View, Text } from 'react-native'
import {useState, useEffect} from 'react';

export default function ApiCallTest() {
    const [data,setData] = useState(null);
    useEffect(() => {
        fetch('http://localhost:3030').then(response => response.json()).then(json => setData(json)).catch(error => console.log(error)); 
    }, []);
    return
    (
        
        
        <Text>
            {json.stringify(data)}
        </Text>
    )
}