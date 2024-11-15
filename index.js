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
    parse(data) {
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
    console.log(data)
    
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
    console.log(data)
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
  // console.log(suppliers.flat())
  return suppliers.flat()
}
fetchSuppliers()
