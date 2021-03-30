import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
// import { MapView } from "expo";
import MapViewDirections from "react-native-maps-directions";
import { COLORS, FONTS, icons, SIZES, GOOGLE_API_KEY } from "../constants"
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const RideMap = ({ route, navigation }) => {

    const mapView = React.useRef()

    const [riderInfo, setRiderInfo] = React.useState(null)
    const [riderSelected, setRiderSelected] = React.useState(null)
    // const [riderId, setRiderId] = React.useState(null)

    const [myInfo, setMyInfo] = React.useState(null)
    const [myLocation, setMyLocation] = React.useState(null)
    const [streetName, setStreetName] = React.useState("")
    const [ridersLoc, setRidersLocation] = React.useState(null)
    const [region, setRegion] = React.useState(null)

    const [duration, setDuration] = React.useState(0)
    const [isReady, setIsReady] = React.useState(false)
    const [angle, setAngle] = React.useState(0)

    React.useEffect(() => {
        let { ridersdata, mydata } = route.params;
        let myLoc = mydata.location

        let ridersLoc = ridersdata.map(el => el.location)
        let street = mydata.streetName

        let mapRegion = {
            latitude: (myLoc.latitude + ridersLoc[0].latitude + ridersLoc[1].latitude) / 3,
            longitude: (myLoc.longitude + ridersLoc[0].longitude + ridersLoc[1].longitude) / 3,
            latitudeDelta: Math.abs(myLoc.latitude - ridersLoc[0].latitude - ridersLoc[1].latitude) * 0.02,
            longitudeDelta: Math.abs(myLoc.longitude - ridersLoc[0].longitude - ridersLoc[1].latitude) * 0.02
            // latitude: (fromLoc.latitude + toLoc[0].latitude + toLoc[1].latitude) / 3,
            // longitude: (fromLoc.longitude + toLoc[0].longitude + toLoc[1].longitude) / 3,
            // latitudeDelta: Math.abs(fromLoc.latitude - toLoc[0].latitude - toLoc[1].latitude) * 0.02,
            // longitudeDelta: Math.abs(fromLoc.longitude - toLoc[0].longitude - toLoc[1].latitude) *0.02 
        }

        setMyInfo(mydata)
        setRiderInfo(ridersdata)
        setMyLocation(myLoc)
        setStreetName(street)
        setRidersLocation(ridersLoc)
        setRegion(mapRegion)

    }, [])

    // function calculateAngle(coordinates) {
    //     let startLat = coordinates[0]["latitude"]
    //     let startLng = coordinates[0]["longitude"]
    //     let endLat = coordinates[1]["latitude"]
    //     let endLng = coordinates[1]["longitude"]
    //     let dx = endLat - startLat
    //     let dy = endLng - startLng

    //     return Math.atan2(dy, dx) * 180 / Math.PI
    // }

    // function zoomIn() {
    //     let newRegion = {
    //         latitude: region.latitude,
    //         longitude: region.longitude,
    //         latitudeDelta: region.latitudeDelta / 2,
    //         longitudeDelta: region.longitudeDelta / 2
    //     }

    //     setRegion(newRegion)
    //     mapView.current.animateToRegion(newRegion, 200)
    // }

    // function zoomOut() {
    //     let newRegion = {
    //         latitude: region.latitude,
    //         longitude: region.longitude,
    //         latitudeDelta: region.latitudeDelta * 2,
    //         longitudeDelta: region.longitudeDelta * 2
    //     }

    //     setRegion(newRegion)
    //     mapView.current.animateToRegion(newRegion, 200)
    // }

    function renderMap() {
        const ridersMarker = () => (
            riderInfo?.map(el => (

                <Marker
                    coordinate={el.location}
                    onPress={() => !riderSelected ? setRiderSelected(el.id) : setRiderSelected(null)}
                >
                    <View
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#54e346'
                        }}
                    >
                        <View
                            style={{
                                height: 32,
                                width: 32,
                                borderRadius: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.white
                            }}
                        >
                            <Image
                                source={el?.icon.avatar}
                                style={{
                                    width: 27,
                                    height: 27,
                                    // tintColor: COLORS.white
                                }}
                            />
                        </View>

                    </View>
                </Marker>
            )
            )

        )

        const myMarker = () => (
            <Marker
                coordinate={myLocation}
                anchor={{ x: 0.5, y: 0.5 }}
                flat={true}
                rotation={angle}
            >
                {/* <View
                    style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#54e346'
                    }}
                >
                    <View
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.white
                        }}
                    > */}
                        <MaterialIcons name="directions-bike" size={30} color="black" />
                        {/* <Image
                            source={myInfo?.icon.avatar}
                            style={{
                                width: 35,
                                height: 35
                            }}
                //         /> */}
                {/* //     </View> */}
                {/* // </View> */}
            </Marker>
        )

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapView}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    style={{ flex: 1 }}

                >
                    <MapViewDirections
                        origin={myLocation}
                        destination={ridersLoc}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={5}
                        strokeColor={COLORS.primary}
                        optimizeWaypoints={true}
                        onReady={result => {
                            setDuration(result.duration)

                            if (!isReady) {
                                // Fit route into maps
                                mapView.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: (SIZES.width / 20),
                                        bottom: (SIZES.height / 4),
                                        left: (SIZES.width / 20),
                                        top: (SIZES.height / 8)
                                    }
                                })

                                // Reposition the car
                                let nextLoc = {
                                    latitude: result.coordinates[0]["latitude"],
                                    longitude: result.coordinates[0]["longitude"]
                                }

                                if (result.coordinates.length >= 2) {
                                    let angle = calculateAngle(result.coordinates)
                                    setAngle(angle)
                                }

                                setMyLocation(nextLoc)
                                setIsReady(true)
                            }
                        }}
                    />
                    {ridersMarker()}
                    {myMarker()}
                </MapView>
            </View>
        )
    }

    function renderDestinationHeader() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 0,
                    right: 0,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: SIZES.width * 0.9,
                        paddingVertical: SIZES.padding,
                        paddingHorizontal: SIZES.padding * 2,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                >
                    <Image
                        source={icons.red_pin}
                        style={{
                            width: 30,
                            height: 30,
                            marginRight: SIZES.padding
                        }}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={{ ...FONTS.body3 }}>{streetName}</Text>
                    </View>

                    <Text style={{ ...FONTS.body3 }}>{Math.ceil(duration)} mins</Text>
                </View>
            </View>
        )
    }

    function renderDeliveryInfo(selectedId) {

        const selectedRider = riderInfo?.filter(rider => rider.id == selectedId)

        console.log(selectedRider[0].icon)
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        width: SIZES.width * 0.9,
                        paddingVertical: SIZES.padding * 3,
                        paddingHorizontal: SIZES.padding * 2,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Avatar */}
                        <Image
                            source={selectedRider[0]?.icon.avatar}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25
                            }}
                        />

                        <View style={{ flex: 1, marginLeft: SIZES.padding }}>
                            {/* Name & Rating */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ ...FONTS.h4 }}>{selectedRider[0]?.icon.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={icons.star}
                                        style={{ width: 18, height: 18, tintColor: COLORS.primary, marginRight: SIZES.padding }}
                                    />
                                    <Text style={{ ...FONTS.body3 }}>{selectedRider[0]?.rating}</Text>
                                </View>
                            </View>

                            {/* Restaurant */}
                            <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>{selectedRider[0]?.name}</Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: SIZES.padding * 2,
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 50,
                                marginRight: 10,
                                backgroundColor: COLORS.primary,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                            onPress={() => navigation.navigate("Home")}
                        >
                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 50,
                                backgroundColor: COLORS.secondary,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10
                            }}
                            onPress={() => setRiderSelected(null)}
                        >
                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        )
    }

    function renderUpperButtons() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: SIZES.height * 0.01,
                    // right: SIZES.padding * 0.2,
                    // left: SIZES.padding * 0.2,
                    width: SIZES.width,
                    height: 70,
                    flexDirection: 'row',
                    // alignItems: 'baseline',
                    justifyContent: 'space-between',
                    // backgroundColor: COLORS.white,

                }}
            >
                {/* chat */}
                <TouchableOpacity
                    style={{
                        width: 50,
                        height: 50,

                        borderRadius: 25,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}
                    onPress={() => navigation.navigate("Home")}                >


                    <View
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.white
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </View>
                </TouchableOpacity>

                {/* message*/}
                {/* <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: SIZES.width * 0.5,
                        height:40,
                        paddingVertical: SIZES.padding,
                        paddingHorizontal: SIZES.padding * 2,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                >
                    <Image
                        source={icons.red_pin}
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: SIZES.padding
                        }}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={{ ...FONTS.body3 }}>{streetName}</Text>
                    </View>

                    <Text style={{ ...FONTS.body3 }}>{Math.ceil(duration)} mins</Text>
                </View> */}


                {/* functions */}
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}
                // onPress={() => zoomOut()}
                >
                    <View
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.white
                        }}
                    >
                        <MaterialIcons name="report" size={24} color="black" />
                    </View>
                    {/* <Text style={{ ...FONTS.body1 }}>-</Text> */}
                </TouchableOpacity>
            </View >

        )
    }
    function renderBottomButtons() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: SIZES.height * 0.02,
                    // right: SIZES.padding * 0.2,
                    // left: SIZES.padding * 0.2,
                    width: SIZES.width,
                    height: 70,
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-around',
                    // backgroundColor: COLORS.white,

                }}
            >
                {/* chat */}
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,

                        borderRadius: 30,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}
                // onPress={() => zoomIn()}
                >

                    <View
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.white
                        }}
                    >
                        <Ionicons name="chatbubble-ellipses-outline" size={30} color="black" />

                    </View>
                </TouchableOpacity>
                {/* START*/}
                <TouchableOpacity
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: 45,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.white

                    }}
                // onPress={() => zoomIn()}
                >
                    <View
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.white
                        }}
                    >
                        <Ionicons name="ios-bicycle-outline" size={40} color="black" />
                    </View>
                </TouchableOpacity>

                {/* functions */}
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}
                // onPress={() => zoomOut()}
                >
                    <View
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: COLORS.white
                        }}
                    >
                        <Fontisto name="camera" size={24} color="black" />
                    </View>
                    {/* <Text style={{ ...FONTS.body1 }}>-</Text> */}
                </TouchableOpacity>
            </View>

        )
    }

    return (
        <View style={{ flex: 1 }}>
            {renderMap()}
            {renderUpperButtons()}
            {/* {renderDestinationHeader()} */}
            {renderBottomButtons()}
            {riderSelected && renderDeliveryInfo(riderSelected)}
        </View>
    )
}

export default RideMap;