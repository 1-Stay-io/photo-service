const fs = require('fs');
const csvWriter = require('csv-write-stream');
const faker = require('faker');
const milTenMil = require('./pregenerated/milTenMil');
const milThousand = require('./pregenerated/milThousand');

const writer = csvWriter();

//helper functions----------------------------------------------
let photoListing = 0;
//n = numer of listings (10M)
getListingForPhoto = () => {
  if (photoListing > 9999999) {
    photoListing = 1;
  } else {
    photoListing += 1;
  }
  return photoListing;
}

let favListNum = 0;
getFavForList = () => {
  if (favListNum > 9999999) {
    favListNum = 1;
  } else {
    favListNum += 1;
  }
  return favListNum;
}


let lastIndex = 0;
randNumTenMil = () => {
  if (lastIndex >= 999999) {
    lastIndex = randInt(100);
  }
  lastIndex += 1;
  return milTenMil[lastIndex];
};

let thouIndex = 0;
randNumThousand = () => {
  if (thouIndex >= 999999) {
    thouIndex = randInt(100);
  }
  thouIndex += 1;
  return milThousand[thouIndex];
};

randInt = (n) => {
  return Math.floor(Math.random() * n) + 1;
};

randomNumBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);

randArrayOfListings = () => {
  let result = [];
  for (var i = 0; i < randInt(10); i++) {
    result.push(randNumTenMil());
  }
  return result;
};

randArrayOfPhotos = () => {
  let result = [];
  for (var i = 0; i < randInt(20); i++) {
    result.push(photoGenerator());
  }
  return result;
};

photoGenerator = () => {
  return `https://stayio.s3-us-west-1.amazonaws.com/Airbnb_images/home${randNumThousand()}.jpg`;
};


createListing = () => {
  let listing = {
    listingName        : faker.lorem.words(2),
    listingDescription : faker.lorem.sentence(),
    listingLocation    : `${faker.address.city()}, ${faker.address.stateAbbr()}`,
    listingStars       : randNumThousand() / 200,
    listingNumReviews  : randNumThousand(),
    // photos : `{${randArrayOfPhotos()}}`
  };
  return listing;
};

createPhoto = () => {
  let photo = {
    listingId: getListingForPhoto(),
    photoDescription : faker.lorem.words(2),
    photoUrl         : photoGenerator(),
  };
  return photo;
};

createUser = () => {
  let user = {
    userName  : faker.lorem.word()
  };
  return user;
};

createUserList = () => {
  let userList = {
    userId   : Math.floor(randNumTenMil() / 10),
    listName : faker.lorem.word()
  };
  return userList;
};

createFavListings = () => {
  let favListing = {
    listId    : getFavForList(),
    listingId : randNumTenMil()
  };
  return favListing;
};

const dataGen = (i, name, createFunc, cb) => {
  console.time(name);
  const writer = csvWriter();
  writer.pipe(fs.createWriteStream(__dirname + `/csv/${name}.csv`));

  function write() {
    let ok = true;
    do {
      if (i % 1000000 === 0) {
        console.log(name, i);
      }
      i--;
      let newItem = createFunc();
      if (i === 0) {
        writer.write(newItem, cb);
      } else {
        ok = writer.write(newItem);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
};

dataGen(10000000, 'listingsSQL', createListing, () => {
  writer.end();
  console.timeEnd('listingsSQL');
});

dataGen(1000000, 'usersSQL', createUser, () => {
  writer.end();
  console.timeEnd('usersSQL');
});

dataGen(150000000, 'photosSQL', createPhoto, () => {
  writer.end();
  console.timeEnd('photosSQL');
});

dataGen(10000000, 'userListsSQL', createUserList, () => {
  writer.end();
  console.timeEnd('userListsSQL');
});

dataGen(30000000, 'favListingsSQL', createFavListings, () => {
  writer.end();
  console.timeEnd('favListingsSQL');
});
