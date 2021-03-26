import  React,{ useState, useEffect ,useRef} from 'react';
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

const RideMap = ({ route, navigation }) => {

    const mapView = useRef()

    const [riderInfo, setRiderInfo] = useState(null)
    const [streetName, setStreetName] = useState("")
    const [mylocation, setMyLocation] = useState(null)
    const [riderLocation, setRiderLocation] = useState(null)
    const [riderIcon, setRiderIcon] = useState(null)
    const [region, setRegion] = useState(null)

    const [duration, setDuration] = useState(0)
    const [isReady, setIsReady] = useState(false)
    const [angle, setAngle] = useState(0)

    useEffect(() => {
        let { Ridersdata, Mydata } = route.params;
        console.log("prams=> ", Ridersdata, typeof (Ridersdata));
        // Object.entries(obj).map(([key, value]) => ({key, value}))
        // let { icon, id, location,status_txt, rating } = Ridersdata[0];
        // console.log("icon=> ", icon);
        // setRiderInfo(Ridersdata)
        // console.log("riderinfo=> ", riderInfo);
        //ユーザーたちの位置情報セット
        let myLoc = Mydata.gps;
        let ridersLoc = Ridersdata.map(el => el.location);
        let ridersIcon = Ridersdata.map(el => el.icon);
        
        let street = Mydata.streetName;
       
        
        //マップの縮尺セット
        // todo turn it to a function
        let mapRegion = {
            // latitude: (myLoc.latitude + ridersLoc.latitude) / 2,
            // longitude: (myLoc.longitude + ridersLoc.longitude) / 2,
            // latitudeDelta: Math.abs(myLoc.latitude - ridersLoc.latitude) * 2,
            // longitudeDelta: Math.abs(myLoc.longitude - ridersLoc.longitude) * 2
            latitude: (myLoc.latitude + ridersLoc[0].latitude + ridersLoc[1].latitude) / 2,
            longitude: (myLoc.longitude + ridersLoc[0].longitude + ridersLoc[1].longitude) / 2,
            latitudeDelta: Math.abs(myLoc.latitude - ridersLoc[0].latitude - ridersLoc[1].latitude) * 2,
            longitudeDelta: Math.abs(myLoc.longitude - ridersLoc[0].longitude - ridersLoc[1].latitude) * 2
        }
        
        setRiderLocation(ridersLoc)
        setRiderIcon(ridersIcon)
        // console.log("ridersLoc =>", riderLocation);
        // console.log("ridersIcon =>", riderIcon);
        setRiderInfo(Ridersdata)
        setStreetName(street)
        setMyLocation(myLoc)
        setRegion(mapRegion)

    }, [])

    function calculateAngle(coordinates) {
        let startLat = coordinates[0]["latitude"]
        let startLng = coordinates[0]["longitude"]
        let endLat = coordinates[1]["latitude"]
        let endLng = coordinates[1]["longitude"]
        let dx = endLat - startLat
        let dy = endLng - startLng

        return Math.atan2(dy, dx) * 180 / Math.PI
    }

    function zoomIn() {
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2
        }

        setRegion(newRegion)
        mapView.current.animateToRegion(newRegion, 200)
    }

    function zoomOut() {
        let newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2
        }

        setRegion(newRegion)
        mapView.current.animateToRegion(newRegion, 200)
    }

    function renderMap() {
        const ridersMarker = () => (
            // riderLocation.map(loc => (
            <Marker
                coordinate={riderLocation}
            // coordinate={loc.location}
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
                            source={riderIcon[0].icon.avatar}
                            style={{
                                width: 27,
                                height: 27,
                                // tintColor: COLORS.white
                            }}
                        />
                    </View>
                </View>
            </Marker >
            // )
            // )

        )

        const myMarker = () => (
            <Marker
                coordinate={mylocation}
                anchor={{ x: 0.5, y: 0.5 }}
                flat={true}
                rotation={angle}
            >
                <Image
                    source={icons.car}
                    style={{
                        width: 40,
                        height: 40
                    }}
                />
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
                    {/* <MapViewDirections
                        origin={mylocation}
                        destination={riderLocation}
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

                                setFromLocation(nextLoc)
                                setIsReady(true)
                            }
                        }}
                    /> */}
                    {ridersMarker()}
                    {myMarker()}
                </MapView>
            </View>
        )
    }

    // function renderDestinationHeader() {
    //     return (
    //         <View
    //             style={{
    //                 position: 'absolute',
    //                 top: 50,
    //                 left: 0,
    //                 right: 0,
    //                 height: 50,
    //                 alignItems: 'center',
    //                 justifyContent: 'center'
    //             }}
    //         >
    //             <View
    //                 style={{
    //                     flexDirection: 'row',
    //                     alignItems: 'center',
    //                     width: SIZES.width * 0.9,
    //                     paddingVertical: SIZES.padding,
    //                     paddingHorizontal: SIZES.padding * 2,
    //                     borderRadius: SIZES.radius,
    //                     backgroundColor: COLORS.white
    //                 }}
    //             >
    //                 <Image
    //                     source={icons.red_pin}
    //                     style={{
    //                         width: 30,
    //                         height: 30,
    //                         marginRight: SIZES.padding
    //                     }}
    //                 />

    //                 <View style={{ flex: 1 }}>
    //                     <Text style={{ ...FONTS.body3 }}>{streetName}</Text>
    //                 </View>

    //                 <Text style={{ ...FONTS.body3 }}>{Math.ceil(duration)} mins</Text>
    //             </View>
    //         </View>
    //     )
    // }

    // function renderDeliveryInfo() {
    //     return (
    //         <View
    //             style={{
    //                 position: 'absolute',
    //                 bottom: 50,
    //                 left: 0,
    //                 right: 0,
    //                 alignItems: 'center',
    //                 justifyContent: 'center'
    //             }}
    //         >
    //             <View
    //                 style={{
    //                     width: SIZES.width * 0.9,
    //                     paddingVertical: SIZES.padding * 3,
    //                     paddingHorizontal: SIZES.padding * 2,
    //                     borderRadius: SIZES.radius,
    //                     backgroundColor: COLORS.white
    //                 }}
    //             >
    //                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                     {/* Avatar */}
    //                     <Image
    //                         source={riderInfo?.icon.avatar}
    //                         style={{
    //                             width: 50,
    //                             height: 50,
    //                             borderRadius: 25
    //                         }}
    //                     />

    //                     <View style={{ flex: 1, marginLeft: SIZES.padding }}>
    //                         {/* Name & Rating */}
    //                         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    //                             <Text style={{ ...FONTS.h4 }}>{riderInfo?.icon.name}</Text>
    //                             <View style={{ flexDirection: 'row' }}>
    //                                 <Image
    //                                     source={icons.star}
    //                                     style={{ width: 18, height: 18, tintColor: COLORS.primary, marginRight: SIZES.padding }}
    //                                 />
    //                                 <Text style={{ ...FONTS.body3 }}>{riderInfo?.rating}</Text>
    //                             </View>
    //                         </View>

    //                         {/* rider */}
    //                         <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>{riderInfo?.name}</Text>
    //                     </View>
    //                 </View>

    //                 {/* Buttons */}
    //                 <View
    //                     style={{
    //                         flexDirection: 'row',
    //                         marginTop: SIZES.padding * 2,
    //                         justifyContent: 'space-between'
    //                     }}
    //                 >
    //                     <TouchableOpacity
    //                         style={{
    //                             flex: 1,
    //                             height: 50,
    //                             marginRight: 10,
    //                             backgroundColor: COLORS.primary,
    //                             alignItems: 'center',
    //                             justifyContent: 'center',
    //                             borderRadius: 10
    //                         }}
    //                         onPress={() => navigation.navigate("Home")}
    //                     >
    //                         <Text style={{ ...FONTS.h4, color: COLORS.white }}>Call</Text>
    //                     </TouchableOpacity>

    //                     <TouchableOpacity
    //                         style={{
    //                             flex: 1,
    //                             height: 50,
    //                             backgroundColor: COLORS.secondary,
    //                             alignItems: 'center',
    //                             justifyContent: 'center',
    //                             borderRadius: 10
    //                         }}
    //                         onPress={() => navigation.goBack()}
    //                     >
    //                         <Text style={{ ...FONTS.h4, color: COLORS.white }}>Cancel</Text>
    //                     </TouchableOpacity>
    //                 </View>

    //             </View>
    //         </View>
    //     )
    // }

    // function renderButtons() {
    //     return (
    //         <View
    //             style={{
    //                 position: 'absolute',
    //                 bottom: SIZES.height * 0.35,
    //                 right: SIZES.padding * 2,
    //                 width: 60,
    //                 height: 130,
    //                 justifyContent: 'space-between'
    //             }}
    //         >
    //             {/* Zoom In */}
    //             <TouchableOpacity
    //                 style={{
    //                     width: 60,
    //                     height: 60,
    //                     borderRadius: 30,
    //                     backgroundColor: COLORS.white,
    //                     alignItems: 'center',
    //                     justifyContent: 'center'
    //                 }}
    //                 onPress={() => zoomIn()}
    //             >
    //                 <Text style={{ ...FONTS.body1 }}>+</Text>
    //             </TouchableOpacity>

    //             {/* Zoom Out */}
    //             <TouchableOpacity
    //                 style={{
    //                     width: 60,
    //                     height: 60,
    //                     borderRadius: 30,
    //                     backgroundColor: COLORS.white,
    //                     alignItems: 'center',
    //                     justifyContent: 'center'
    //                 }}
    //                 onPress={() => zoomOut()}
    //             >
    //                 <Text style={{ ...FONTS.body1 }}>-</Text>
    //             </TouchableOpacity>
    //         </View>

    //     )
    // }

    return (
        <View style={{ flex: 1 }}>
            {renderMap()}
            {/* {renderDestinationHeader()}
            {renderDeliveryInfo()}
            {renderButtons()} */}
        </View>
    )
}

export default RideMap;