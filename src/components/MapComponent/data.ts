const angonoPolygonCoords = [
  { lat: 14.561232, lng: 121.165556 },
  { lat: 14.553077, lng: 121.157743 },
  { lat: 14.547593, lng: 121.152438 },
  { lat: 14.541951, lng: 121.147043 },
  { lat: 14.534706, lng: 121.140149 },
  { lat: 14.533594, lng: 121.139076 },
  { lat: 14.530655, lng: 121.144194 },
  { lat: 14.529046, lng: 121.143304 },
  { lat: 14.528235, lng: 121.143304 },
  { lat: 14.526605, lng: 121.143196 },
  { lat: 14.524154, lng: 121.14237 },
  { lat: 14.516935, lng: 121.145664 },
  { lat: 14.516967, lng: 121.147477 },
  { lat: 14.517372, lng: 121.147702 },
  { lat: 14.518369, lng: 121.149837 },
  { lat: 14.518201, lng: 121.152095 },
  { lat: 14.520564, lng: 121.153962 },
  { lat: 14.525845, lng: 121.157948 },
  { lat: 14.530466, lng: 121.162271 },
  { lat: 14.530882, lng: 121.162692 },
  { lat: 14.531609, lng: 121.16383 },
  { lat: 14.531695, lng: 121.164034 },
  { lat: 14.532164, lng: 121.165347 },
  { lat: 14.532389, lng: 121.169786 },
  { lat: 14.532885, lng: 121.175121 },
  { lat: 14.533375, lng: 121.180356 },
  { lat: 14.534114, lng: 121.188278 },
  { lat: 14.53493, lng: 121.197049 },
  { lat: 14.543818, lng: 121.196195 },
  { lat: 14.553482, lng: 121.19164 },
  { lat: 14.559548, lng: 121.189664 },
  { lat: 14.55409, lng: 121.169605 },
  { lat: 14.547439, lng: 121.163502 },
  { lat: 14.549249, lng: 121.161264 },
  { lat: 14.555208, lng: 121.165873 },
  { lat: 14.558805, lng: 121.168648 },
  { lat: 14.561222, lng: 121.165575 },
];

export const getHardcodedMuseums = () => {
  return [
    {
      name: "Angkla Art Gallery",
      geometry: {
        location: new google.maps.LatLng(14.5259329, 121.1550276),
      },
    },
    {
      name: "Balagtas Gallerie",
      geometry: {
        location: new google.maps.LatLng(14.7062038, 120.8152499),
      },
    },
    {
      name: "Balaw-Balaw Art Gallery",
      geometry: {
        location: new google.maps.LatLng(14.5274358, 121.1576875),
      },
    },
    {
      name: "Blanco Family Museum",
      geometry: {
        location: new google.maps.LatLng(14.5252726, 121.149363),
      },
    },
    {
      name: "Giant Dwarf Art Space",
      geometry: {
        location: new google.maps.LatLng(14.5274459, 121.1572029),
      },
    },
    {
      name: "House of Botong Francisco",
      geometry: {
        location: new google.maps.LatLng(14.5267044, 121.151509),
      },
    },
    {
      name: "Nemiranda Arthouse",
      geometry: {
        location: new google.maps.LatLng(14.5305022, 121.1538906),
      },
    },
    {
      name: "Nono Museum",
      geometry: {
        location: new google.maps.LatLng(14.5305022, 121.1538906),
      },
    },
    {
      name: "Angono Petroglyphs",
      geometry: {
        location: new google.maps.LatLng(14.5313843, 121.1827942),
      },
    },
    {
      name: "Kuta Artspace",
      geometry: {
        location: new google.maps.LatLng(14.5258091, 121.1573982),
      },
    },
  ];
};

export const hardcodedMuseumNames = [
  "Angkla Art Gallery",
  "Balagtas Gallery",
  "Balaw-Balaw Art Gallery",
  "Blanco Family Museum",
  "Giant Dwarf Art Space",
  "House of Botong Francisco",
  "Nemiranda Arthouse",
  "Nono Museum",
  "Angono Petroglyphs",
  "Kuta Artspace",
];

export default angonoPolygonCoords;
