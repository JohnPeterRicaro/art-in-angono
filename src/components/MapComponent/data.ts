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
      description: `Situated in the Boundary of Angono-Binangonan highway,
       Angkla Art Gallery is one of the rising galleries in town that offers
        a venue for local artists of Angono. It Started its inaugural
         art exhibit on May 8, 2017 through BIGKIS Art Exhibit.
          There are several  art exhibits that have been launched in
           Angkla because of its owner’s vision and mission to cater
            a perfect venue for artists to execute their paintings.
             You may visit Angkla Art Gallery in 3rd floor of CPV
              Business Center, Manila East Road Angono-Binangonan
               boundary managed by Ms. Joy Vocalan Cruz, Dangal
                ng Bayan Awardee in Music and Artist.
                 Aaron Bautista coordinator/curator of the said gallery.`,
    },
    {
      name: "Balagtas Gallerie",
      geometry: {
        location: new google.maps.LatLng(14.7062038, 120.8152499),
      },
      description: `Balagtas Gallerie was established in commemoration for the late Angelito Balagtas. It was opened on December 14, 2021 which dates the birthday of the late artist. The opening of Balagtas Gallerie garnered the artists of Angono Ateliers Association Philippines in their tribute for the late Angelito Balagtas. Balagtas Gallerie serves as the home office for the Angono Ateliers Association Philippines which caters artworks and exhibitions from various artists, developing and professional.`,
    },
    {
      name: "Balaw-Balaw Art Gallery",
      geometry: {
        location: new google.maps.LatLng(14.5274358, 121.1576875),
      },
      description: `Balaw-Balaw is a well known Filipino Restaurant located in Angono, Rizal, Philippines. It gained fame for its unique and adventurous menu, which includes exotic dishes not typically found in mainstream Filipino cuisine. One of its most famous offerings is “balaw-balaw” a dish made from fermented rice with shrimp or fish, which gives the restaurant its name. `,
    },
    {
      name: "Blanco Family Museum",
      geometry: {
        location: new google.maps.LatLng(14.5252726, 121.149363),
      },
      description: `The museum houses the vast collection of artwork produced by the Blanco family of painters. Headed by renowned painter Jose “Pitok” V. Blanco, the Blanco family has produced a prodigious array of visual art depicting Angono’s idyllic rural life, colorful fiestas and religious celebrations. Experience the pleasing and relaxing paintings of Blanco Family Museum and be one of the witness of their great work of arts in Angono, Rizal. A museum that accommodates an anthology of paintings by the members of the family as well as some memorabilia through the years.`,
    },
    {
      name: "Giant Dwarf Art Space",
      geometry: {
        location: new google.maps.LatLng(14.5274459, 121.1572029),
      },
      description: `An art space run by a group of artists is another addition to the art galleries and museums in Angono. Opened in 2018, Giant Dwarf Art Space is a new exhibition venue for Contemporary art. It has two galleries, one for the second floor, another on the third floor of the Nemiranda Building along Manila East Road. Art Exhibitions vary from paintings to sculptures to photos to art experimentations. Its name derived from the icons of Angono folk art, higante (giant) and ang nuno (dwarf).`,
    },
    {
      name: "House of Botong Francisco",
      geometry: {
        location: new google.maps.LatLng(14.5267044, 121.151509),
      },
      description: `Also known as the second gallery owned and run by Totong Francisco, the grandson of the late National Artist for Visual Arts Carlos “Botong” Francisco. Located at Barangay Poblacion Itaas along Dona Aurora Street. The Gallery houses the artworks of Totong Francisco and is home to Botong’s continued legacy.`,
    },
    {
      name: "Nemiranda Arthouse",
      geometry: {
        location: new google.maps.LatLng(14.5305022, 121.1538906),
      },
      description: `Owned by Mr. Nemesio “Nemi” R. Miranda Jr. located at Barangay San Roque. The place is a restaurant and gallery which houses his artworks and other works of local artists. His works are described as “imaginative figurism” portraying rural life and folklore.`,
    },
    {
      name: "Nono Museum",
      geometry: {
        location: new google.maps.LatLng(14.5305022, 121.1538906),
      },
      description: `Nono Museum of Art History is a Museum containing various collections of Arts, History and Culture way back when Angono was still a Hacienda. This is a place where you can see some artworks of the Masters of Angono Juan Senson and Pedro Penon. In the museum’s centerpiece is the painting made by Jose “Pitok” Blanco.`,
    },
    {
      name: "Angono Petroglyphs",
      geometry: {
        location: new google.maps.LatLng(14.5313843, 121.1827942),
      },
      description: `A precursor to Angono’s Artistry, this cultural heritage dates back to circa 3000 BCE and is the most ancient Filipino, or more aptly, prehistoric Filipino work of art. The Existence of the rock engravings was reported to the National Museum by the late National Artist for Visual Arts, Carlos “Botong” Francisco. In 1973, by virtue of Presidential Decree No. 260, it was discovered as a national cultural treasure by the Philippine Government.`,
    },
    {
      name: "Kuta Artspace",
      geometry: {
        location: new google.maps.LatLng(14.5258091, 121.1573982),
      },
      description: "",
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
