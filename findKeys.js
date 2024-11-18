const { rejects } = require('assert')
const axios =  require('axios')
const { promises, resolve } = require('dns')

des = [ 
        'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme', 
        'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia',           
        'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies'
        ]

acme = [
  'Id',         
  'DestinationId',
  'Name',      
  'Latitude',
  'Longitude', 
  'Address',
  'City',      
  'Country',
  'PostalCode', 
  'Description',
  'Facilities'
]

patagonia = [
    'id',    
    'destination',
    'name',
    'lat',
    'lng',
    'address',
    'info',
    'amenities',
    'images'
  ]
paperflies = [
    'hotel_id',
    'destination_id',
    'hotel_name',
    'location',
    'details',
    'amenities',
    'images',
    'booking_conditions'
  ]

megredKeys = [
    'id',
    'destination_id',
    'name',
    'location',
    'description',
    'amenities',
    'images',
    'booking_conditions'
  ]
const fetchAll = async () => {
  var amenitiy = []
  const results = await Promise.all(
    des.map(async (url) => {
      try {
        const res = await axios.get(url);
        console.log(res.data)

      } catch (err) {
        console.log(err);
      }
      console.log('\n')
    })
  );
  // console.log(amenitiy)

}


fetchAll();
//from the out put
// general: [
//   'outdoor pool',
//   'indoor pool',
//   'business center',
//   'childcare',
//   'parking',
//   'bar',
//   'dry cleaning',
//   'wifi',
//   'breakfast',
//   'concierge',
//   'pool',
//   'businesscenter',
//   'drycleaning'
// ],
// room: [
//   'tv',
//   'coffee machine',
//   'kettle',
//   'hair dryer',
//   'iron',
//   'aircon',
//   'minibar',
//   'bathtub',
//   'tub'
// ]


// axios.get('https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme ')
// .then(res => console.log(res.data))
// .catch(err => console.log(err))

// const sampleObject = [
//     {
//       "id": "iJhz",
//       "destination_id": 5432,
//       "name": "Beach Villas Singapore",
//       "location": {
//         "lat": 1.264751,
//         "lng": 103.824006,
//         "address": "8 Sentosa Gateway, Beach Villas, 098269",
//         "city": "Singapore",
//         "country": "Singapore"
//       },
//       "description": "Surrounded by tropical gardens, these upscale villas in elegant Colonial-style buildings are part of the Resorts World Sentosa complex and a 2-minute walk from the Waterfront train station.",
//       "amenities": {
//         "general": ["outdoor pool", "indoor pool", "business center", "childcare", "wifi", "dry cleaning", "breakfast"],
//         "room": ["aircon", "tv", "coffee machine", "kettle", "hair dryer", "iron", "bathtub"]
//       },
//       "images": {
//         "rooms": [
//           { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/2.jpg", "description": "Double room" },
//           { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/3.jpg", "description": "Double room" },
//           { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/4.jpg", "description": "Bathroom" }
//         ],
//         "site": [
//           { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/1.jpg", "description": "Front" }
//         ],
//         "amenities": [
//           { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/0.jpg", "description": "RWS" }
//         ]
//       },
//       "booking_conditions": [
//         "All children are welcome. One child under 12 years stays free of charge when using existing beds. One child under 2 years stays free of charge in a child's cot/crib. One child under 4 years stays free of charge when using existing beds. One older child or adult is charged SGD 82.39 per person per night in an extra bed. The maximum number of children's cots/cribs in a room is 1. There is no capacity for extra beds in the room.",
//         "Pets are not allowed.",
//         "WiFi is available in all areas and is free of charge."
//       ]
//     }
//   ]
// // console.log(Object.keys(sampleObject[0]))