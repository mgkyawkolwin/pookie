
import { API_URL, STORAGE_KEYS } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";



export function getDrawDateStringInISOFormat() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
}


export async function fetchInfo() : Promise<Response> {
    const res = await fetch(`${API_URL}/pookie/info`);
    return res;
}


export async function fetchLocations() : Promise<Response> {
    const res = await fetch(`${API_URL}/pookie/locations`);
    return res;
}


export async function fetchRooms(location: string) : Promise<Response> {
    const date = getDrawDateStringInISOFormat();
    const res = await fetch(`${API_URL}/pookie/roomnames?location=${location}&drawDate=${encodeURIComponent(date)}`);
    return res;
}


export async function callDrawApi(location: string, roomsCsv: string, noOfPeople: number) : Promise<Response> {
    const date = getDrawDateStringInISOFormat();
    const res = await fetch(API_URL + `/pookie/draw?location=${location}&rooms=${encodeURIComponent(roomsCsv)}&drawDate=${encodeURIComponent(date)}&noOfPeople=${noOfPeople}`);
    return res;
}


export async function hasLastDrawnResult() {
    const lastResult: any = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DRAW_RESULT);
    if (!lastResult) {
        return false;
    }

    // there is draw result, check date
    const drawDate = new Date(getDrawDateStringInISOFormat());
    const lastDrawnDate = new Date(JSON.parse(lastResult).date);

    if (lastDrawnDate.getTime() === drawDate.getTime()) {
        return true;
    }

    return false;
}