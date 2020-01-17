/*
 * Kode ini dibuat oleh Ego Dafma Dasa
 * https://github.com/egodasa
 */
var map, id, markerLokasi;
var posisi = [-0.942942, 100.371857];
var zoom = 13;
/*
 * kegunaan variabel global diatas:
 * map : untuk menampung instance dari google maps
 * id : menampung instance geolocation realtime (mirip seperti cara menampung setInterval pada variabel), agar nanti proses realtime bisa dihentikan
 * markerLokasi : variabel yang akan menampung marker posisi user sekarang. Setiap posisi user berubah, maka marker ini akan diubah posisinya.
 * posisi: posisi awal peta
 * zoom: tingkat zoom peta
 */
 
// daftar key untuk masing-masing penyedia peta kecuali OSM
var mapbox = {
    key: 'pk.eyJ1IjoiZWdvZGFzYSIsImEiOiJjamd4NWkyMmwwNms2MnhsamJvaWQ3NGZmIn0.6ok1IiPZ0sPNXmiIe-iEWA',
    id: ['mapbox.streets','mapbox.satellite']
}
var hereMaps = {
    app_id: 'E17xLy684GUEuKvqCWjC',
    app_code: 'xOGYvX2MLBLm7HDvzJ4E7Q',
    variant: ['normal.day','hybrid.day']
}
var bingMaps = {
    BingMapsKey: 'Amblsqmvthuv21W0xJTYBSk_Vpd8i4w_yovkDX6K8mVb-UlgkypA5uCGXiHel0rd',
    imagerySet: ['Road','AerialWithLabels'],
    culture: 'id'
}
var OpenStreetMap = L.tileLayer.provider('OpenStreetMap');

// semua provider peta diatas akan dimasukkan ke leaflet sebagai layer baru
// variabel untuk penampung layer per penyedia peta
var penyediaPeta = {
    "OpenStreetMap": OpenStreetMap,
    "Mapbox Streets": L.tileLayer.provider('MapBox', {id: mapbox.id[0], accessToken: mapbox.key}),
    "Mapbox Satelite": L.tileLayer.provider('MapBox', {id: mapbox.id[1], accessToken: mapbox.key}),
    "Bing Streets": L.tileLayer.bing({BingMapsKey: bingMaps.BingMapsKey, imagerySet: bingMaps.imagerySet[0], culture: bingMaps.culture}),
    "Bing Satelite": L.tileLayer.bing({BingMapsKey: bingMaps.BingMapsKey, imagerySet: bingMaps.imagerySet[1], culture: bingMaps.culture}),
    "HERE Streets": L.tileLayer.provider('HERE.terrainDay', {app_id: hereMaps.app_id, app_code: hereMaps.app_code}),
    "HERE Satellite": L.tileLayer.provider('HERE.hybridDay', {app_id: hereMaps.app_id, app_code: hereMaps.app_code})
}

function initMap() {
  //variabel penampung peta
  map = L.map('peta', {layers: [OpenStreetMap]}).setView(posisi, zoom); // set layer awal langsung ke OpenStreetMap
  
  L.control.layers(penyediaPeta).addTo(map); // tambahkan semua layer penyedia peta ke instance peta sekarang
    
  markerLokasi = buatMarker(-34.397, 150.644, map);
  perhatikanPosisiUser();
}

// memantau posisi user secara realtime
function perhatikanPosisiUser() {
  if(navigator.geolocation) {
    id = navigator.geolocation.watchPosition(setPosisiUser, 
      function(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0
      });
  } else {
    handleLocationError(false);
  }
}

// stop memantau posisi user
function stopPerhatikanPosisiUser () {
  navigator.geolocation.clearWatch(id);
}

// ubah posisi marker ke posisi tertentu sesuai geolokasi
function setPosisiUser(position)
{
  gantiStatusLokasi("Mencari lokasi Anda...");
  var pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  ambilPosisiUser(pos.lat, pos.lng);
  gantiPosisiMarker(markerLokasi, pos.lat, pos.lng);
  gantiStatusLokasi("Lokasi Anda ditemukan.");
}


// kode untuk menangani kejadian error saat geolokasi error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  if(browserHasGeolocation) {
    gantiStatusLokasi("Error: Gagal mencari lokasi Anda. Pastikan GPS Anda hidup atau <a href='' onclick='window.location.reload();'>Refresh Halaman</a>");
  } else {
    gantiStatusLokasi("Error: Browser Anda tidak mendukung pencarian lokasi. Silahkan ganti atau perbarui browser Anda.");
  }
}

// buat marker baru dan menambahkannya ke peta
function buatMarker(lat, lng, peta)
{
  return L.marker([lat, lng]).addTo(peta);
}

// ganti posisi marker 
function gantiPosisiMarker(marker, lat, lng) {
    map.setView([lat, lng]);
    
    var latlng = new L.LatLng(lat, lng);
    marker.setLatLng(latlng); 

}

// ganti pesan status lokasi
function gantiStatusLokasi(status) {
  document.getElementById("status_lokasi").innerHTML = status;
}

// ambil posisi user dan memasukkannya kedalam form
function ambilPosisiUser(lat, lng) {
  document.getElementsByName("latitude")[0].value = lat;
  document.getElementsByName("longitude")[0].value = lng;
}

