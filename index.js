const axios =  require('axios');

class Hotel {
  constructor( id,
               destination_id,
               name,
               location,
               description,
               amenities,
               images,
               booking_conditions) {
    this.id = id;
    this.destination_id = destination_id;
    this.name = name;
    this.location = location;
    this.description = description;
    this.amenities = amenities;
    this.images = images;
    this.booking_conditions = booking_conditions;
  }
}

class BaseSupplier {
    constructor(){
      //got this const by fetching through 3 destination
      //paperfiles supplier has already sorted data into general and room
      //I looped through others suppliers and find all output that we can get
      //after that finds all the duplicated elements from 2 other supplier with paperfiles and what got all the datas that we need to sort it into the groups
      //manually sorted it into the groups to groups to get these following array
      this.general_const = [
        'outdoor pool',
        'indoor pool',
        'business center',
        'childcare',
        'parking',
        'bar',
        'dry cleaning',
        'wifi',
        'breakfast',
        'concierge',
        'pool',
        'businesscenter',
        'drycleaning'
      ]
      this.room_const = [
        'tv',
        'coffee machine',
        'kettle',
        'hair dryer',
        'iron',
        'aircon',
        'minibar',
        'bathtub',
        'tub'
      ]
    }
    //abstract method 
    endpoint() {
        throw new Error("Must implement endpoint() in subclass");
    }

    //abstract method 
    parse() {
        throw new Error("Must implement parse() in subclass");
    }

    async fetch() {
      let data = null;
      await axios.get(this.endpoint())
      .then(res => data = res.data)
      .catch(err => console.log(err))
      
      return data;
    }
}

class Acme extends BaseSupplier {
  constructor() {
    super();
    
  }
  endpoint() {
    return 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme';
  }

  async parse() {
    const data = await this.fetch();
    const country = {
      5432: "Singapore",
      1122: "Japan",
    };

    let mergedHotel = [];

    data.forEach(hotel => {
      let newHotel = new Hotel(
        hotel.Id,
        hotel.DestinationId,
        hotel.Name,
        {
          lat : hotel.Latitude,
          lng : hotel.Longitude,
          address : hotel.Address.trim(),
          city : hotel.City,
          country : country[hotel.DestinationId]
        },
        hotel.Description.trim(),
        {
          general: [],
          room: []
        },  
        {
          room: [],
          site: [],
          amenities: []
        }, 
        []
      )
      let amenities = {
        general: [],
        room: []
      };
      //map through facilities and divide elements into general and room 
      hotel.Facilities.forEach(facility =>{
        if (this.general_const.includes(facility.toLowerCase().trim())) amenities.general.push(facility.toLowerCase().trim());
        if (this.room_const.includes(facility.toLowerCase().trim())) amenities.room.push(facility.toLowerCase().trim());
      })  
      newHotel.amenities = amenities;
      mergedHotel.push(newHotel);
    })
    return mergedHotel;
  }
}

class Patagonia extends BaseSupplier {
  constructor(){
    super();
  }
  
  endpoint() {
    return 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia'
  }

  async parse() {
    const data = await this.fetch();
    const country = {
      5432: "Singapore",
      1122: "Japan",
    };

    let mergedHotel = [];

    data.forEach(hotel => {
      let newHotel = new Hotel(
        hotel.id,
        hotel.destination,
        hotel.name.trim(),
        {
          lat : hotel.lat,
          lng : hotel.lng,
          address : hotel.address ? hotel.address.trim() : null,
          city : null,
          country : country[hotel.destination]
        },
        hotel.info ? hotel.info.trim() : null,
        {
          general: [],
          room: []
        }, [], []
      )
      let amenities = {
        general: [],
        room: []
      };
      //map through facilities and divide elements into general and room 
      if (hotel.amenities)
        hotel.amenities.forEach(facility =>{
          if (this.general_const.includes(facility.toLowerCase().trim())) amenities.general.push(facility.toLowerCase().trim());
          if (this.room_const.includes(facility.toLowerCase().trim())) amenities.room.push(facility.toLowerCase().trim());
        })  
        newHotel.amenities = amenities;
        mergedHotel.push(newHotel);
    })
    return mergedHotel;
  }
}

class PaperFlies extends BaseSupplier {
  constructor(){
    super();
  }

  endpoint() {
    return 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies'
  }

  async parse() {
    const data = await this.fetch();
    const country = {
      5432: "Singapore",
      1122: "Japan",
    };
    // console.log(data)
    
    let mergedHotel = [];

    data.forEach(hotel => {
      let newHotel = new Hotel(
        hotel.hotel_id,
        hotel.destination_id,
        hotel.hotel_name.trim(),
        {
          lat : null,
          lng : null,
          address : hotel.location.address ? hotel.location.address.trim() : null,
          city : null,
          country : country[hotel.destination_id]
        },
        hotel.details ? hotel.details.trim() : null,
        hotel.amenities, 
        hotel.images, 
        hotel.booking_conditions
      )
 
      mergedHotel.push(newHotel);
    })
    return mergedHotel;
  }
}

const fetchSuppliers = async () => {
  let acme = new Acme();
  let patagonia = new Patagonia();
  let paperflies = new PaperFlies();
  const suppliers = await Promise.all([ acme.parse(), patagonia.parse(), paperflies.parse() ]);
  return suppliers.flat()
}
const merge = async (suppliers) => {
  let sortedHotels = {}
  //sort suppliers by id and destination_id and put them into sortedHotel object as key-value pair
  suppliers.forEach(supplier => { 
    let key = supplier.id + '-' + supplier.destination_id
    // console.log(supplier)
    if (!Object.keys(sortedHotels).includes(key)) {
      sortedHotels = {
        ...sortedHotels,
        [key] : [supplier]
      }
    }
    else {
      sortedHotels = {
        ...sortedHotels,
        [key] : [...sortedHotels[key], supplier]
      }
    }
  })

  let mergedHotels = []
  //sort hotels by id and destination_id
 
  Object.keys(sortedHotels).forEach(key => {
    let id = key.split('-')[0]
    let destinationId = key.split('-')[1]
    let mergedHotel = new Hotel(id, destinationId, null, {
      lat : null,
      lng : null,
      address : null,
      city : null,
      country : null
    }, '', {
      general: [],
      room: []
    }, {
      rooms: [],
      site: [],
      amenities: []
    }, []);
    //merge hotels have the same keys
    sortedHotels[key].forEach(hotel => {
      mergedHotel.name = !mergedHotel.name || hotel.name >= mergedHotel.name ? hotel.name : mergedHotel.name
      mergedHotel.description = !mergedHotel.description || hotel.description?.length > mergedHotel.description?.length ? hotel.description : mergedHotel.description
      mergedHotel.location = { 
        lat : hotel.location?.lat ? hotel.location.lat : mergedHotel.location.lat,
        lng : hotel.location?.lng ? hotel.location.lng : mergedHotel.location.lng,
        address : hotel.location?.address ? hotel.location.address : mergedHotel.location.address,
        city : hotel.location?.city ? hotel.location.city : mergedHotel.location.city,
        country : hotel.location?.country ? hotel.location.country : mergedHotel.location.country
      }
      mergedHotel.amenities = {
        general : hotel.amenities?.general ? [... new Set([...mergedHotel.amenities.general, ...hotel.amenities.general])] : [...mergedHotel.amenities.general],
        room : hotel.amenities?.room ? [... new Set([...mergedHotel.amenities.room, ...hotel.amenities.room])] : [...mergedHotel.amenities.room]
      }
      mergedHotel.images = {
        rooms : hotel.images?.rooms && hotel.images.rooms.length > 0 ? [... new Set([...mergedHotel.images.rooms,...hotel.images.rooms])] : [...mergedHotel.images.rooms],
        site : hotel.images?.site && hotel.images.site.length > 0 ? [... new Set([...mergedHotel.images.site,...hotel.images.site])] : [...mergedHotel.images.site],
        amenities : hotel.images?.amenities && hotel.images.room.length > 0 ? [... new Set([...mergedHotel.images.amenities,...hotel.images.amenities])] : [...mergedHotel.images.amenities]
      }

      mergedHotel.booking_conditions = hotel.booking_conditions ? [... new Set([...mergedHotel.booking_conditions,...hotel.booking_conditions])] : [...mergedHotel.booking_conditions]
    })
    mergedHotels.push(mergedHotel)
  })

  return mergedHotels;
}

const main = async () => { 
  const suppliers = await Promise.all([fetchSuppliers()])
  const mergedHotel = (await Promise.all([merge(suppliers.flat())])).flat()
  const argv = process.argv
  try {
    const hotel_ids = argv[2].split(',')
    const destination_ids = argv[3].split(',')
    if (hotel_ids.includes('none') || destination_ids.includes('none'))
      console.log(JSON.stringify(mergedHotel, null, 2))
    else {
      const filteredHotels = mergedHotel.filter(hotel => hotel_ids.includes(hotel.id.toString()) && destination_ids.includes(hotel.destination_id.toString()))
      console.log(JSON.stringify(filteredHotels, null, 2))
    }
  }
  catch {
    console.log(JSON.stringify(mergedHotel, null, 2))
  }
  
}
main();