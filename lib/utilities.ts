
import { API_URL, STORAGE_KEYS } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";



export function drawDateISO() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
}


export async function fetchVersion() {
    const res = await fetch(`${API_URL}/pookie/version`);
    if (!res.ok) throw new Error('Failed to fetch version');
    const json = await res.json();
    return json;
}


export async function fetchLocations() {
    const res = await fetch(`${API_URL}/pookie/locations`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    const json = await res.json();
    return json;
}


export async function fetchRooms(location: string) {
    const date = drawDateISO();
    const res = await fetch(`${API_URL}/pookie/roomnames?location=${location}&drawDate=${encodeURIComponent(date)}`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    const json = await res.json();
    return json;
}


export async function callDrawApi(location: string, roomsCsv: string, noOfPeople: number) {
    const date = drawDateISO();
    const res = await fetch(API_URL + `/pookie/draw?location=${location}&rooms=${encodeURIComponent(roomsCsv)}&drawDate=${encodeURIComponent(date)}&noOfPeople=${noOfPeople}`);
    // Some servers expect POST; if your backend expects POST change accordingly.
    if (!res.ok) throw new Error('Draw failed');
    const json = await res.json();
    return json; // expected { rooms:string, time: string, hole: string }
}


export async function hasLastDrawnResult() {
    const lastResult: any = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DRAW_RESULT);
    if (!lastResult) {
        return false;
    }

    // there is draw result, check date
    const today = new Date();
    let drawDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));
    drawDate.setUTCDate(drawDate.getUTCDate() + 1);
    const lastDrawnDate = new Date(JSON.parse(lastResult).date);

    if (lastDrawnDate.getTime() === drawDate.getTime()) {
        return true;
    }

    return false;
}