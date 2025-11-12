import {
  StyleSheet
} from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, margin:0, padding:0, backgroundColor: '#000' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 28, fontWeight: '800', marginBottom: 12 },
  header: { fontSize: 25, fontWeight: '600', paddingLeft: "10%", paddingRight: "10%", marginTop: 0, paddingTop: 0, marginBottom: 12, color: '#fff' },
  text: { fontSize: 20, fontWeight: '600', marginBottom: 12, color: '#000' },
  resultText: { fontSize: 25, fontWeight: '600', color: '#000' },
  flatListRow: { padding: 16, borderBottomWidth: 1, borderColor: '#000', backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', fontSize: 50 },
  flatListRowSelected: { backgroundColor: '#f5e97bff' },
  roomText: { fontSize: 30, fontWeight: '600' },
  roomTextSmall: { fontSize: 16 },
  hint: { fontSize: 12, color: '#666' },
  footerRow: { flex: 1, padding: 12, alignItems: 'center', flexDirection: 'row', alignContent: 'space-between', columnGap: 8 },
  footerCol: { padding: 12 },
  btn: { backgroundColor: '#fcf80bff', padding: 12, borderRadius: 8, alignItems: 'center', width: '30%', height: 50 },
  btnText: { color: '#000', fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  kvRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  k: { fontWeight: '600' },
  rectangleBtn: { backgroundColor: '#fcf80bff', borderRadius: 8, alignItems: 'center', width: 50, height: 50 },
  rectangleBtnText: { fontSize: 40, color: '#000', fontWeight: '600', padding: 0, margin: 0 },
  v: { color: '#333' },

  particle: {
    position: 'absolute',
  },
});