import React from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import S from './StyledComponents.js';

class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 1,
      favorites: [],
      newListText: '',
    };
    this.loadFavorites = this.loadFavorites.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.updateFavorite = this.updateFavorite.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { user } = this.state;
    this.loadFavorites(user);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      newListText: event.target.value,
    });
  }

  loadFavorites(userId) {
    axios.get(`/api/photo-carousel/favorites/${userId}`)
      .then((results) => {
        this.setState({
          favorites: results.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addFavorite(newListName) {
    if (newListName === '') {
      return;
    }
    const listingId = parseInt(window.location.pathname.substring(20));
    const newFavorite = {
      userId: this.state.user,
      listName: newListName,
      favoriteLists: [listingId],
    };
    axios.post('/api/photo-carousel/favorites', newFavorite)
      .then(this.loadFavorites(this.state.user))
      .then(this.setState({
        newListText: '',
      }))
      .catch((error) => {
        console.error(error);
      });
  }

  updateFavorite(event, fav) {
    event.preventDefault();
    let listingId = parseInt(window.location.pathname.substring(20));
    let newFavList = fav.favoriteLists;
    if (event.target.id === 'heart') {
      newFavList = newFavList.filter((listing) => (Number(listing) !== Number(listingId)));
    } else {
      newFavList.push(listingId);
    }
    const updatedFavorite = {
      userId: this.state.user,
      listName: fav.listName,
      favoriteLists: newFavList,
    };
    axios.put('/api/photo-carousel/favorites', updatedFavorite)
      .then(this.loadFavorites(this.state.user))
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    function isFavorite(favoriteList) {
      let listingId = parseInt(window.location.pathname.substring(20));
      let isFavorite = false;
      for (var i = 0; i < favoriteList.length; i++) {
        if (favoriteList[i] === listingId) {
          isFavorite = true;
        }
      }
      return isFavorite;
    }
    return (
      <FavoritesModal>
        <InnerModal>
          <h2>Save to a list</h2>
          <hr />
          <FavLists>
            <div>
              <StyledEntry>
                <S.LargeButtonImage src="https://s3-us-west-1.amazonaws.com/fec.home.images/Icons+and+Buttons/Icons+2.0/AddFav.png" onClick={() => this.addFavorite(this.state.newListText)} />
                Create a new List:
                <input type="text" value={this.state.newListText} onChange={this.handleChange} />
              </StyledEntry>
            </div>
            {this.state.favorites.map((fav) => (
              <StyledFav key={fav._id}>
                <ImageAndText>
                  <S.FavoritesButtonImage src="https://s3-us-west-1.amazonaws.com/fec.home.images/Icons+and+Buttons/Icons+2.0/AddFav.png" />
                  {fav.listName}
                </ImageAndText>
                {isFavorite(fav.favoriteLists)
                ? <S.HeartImage src="https://s3-us-west-1.amazonaws.com/fec.home.images/Icons+and+Buttons/Icons+2.0/Heart.png" id="heart" onClick={() => this.updateFavorite(event, fav)} />
                : <S.HeartImage src="https://s3-us-west-1.amazonaws.com/fec.home.images/Icons+and+Buttons/Icons+2.0/EmptyHeart.png" id="no-heart" onClick={() => this.updateFavorite(event, fav)} />}
              </StyledFav>
            ))}
          </FavLists>
          <hr />
          <BottomRow>
            <DoneButton onClick={this.props.toggleFavorites}>Done</DoneButton>
          </BottomRow>
        </InnerModal>
      </FavoritesModal>
    );
  }
}

const slideUp = keyframes`
  0% {
    height: 0px
  }
  100% {
    height: 100%
  }
`;

const FavoritesModal = styled.div`
  position: absolute;
  left: 0px;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(50,50,50,0.6);
  z-index: 10;
  bottom: 0px;
  animation: 300ms ${slideUp} ease-in;
`;

const StyledEntry = styled.div`
  display: flex;
  align-items: center;
  font-family: sans-serif;
  text-align: center;
  padding: 10px;
  &:hover {
    background: rgb(230, 230, 230);
  }
`;

const StyledFav = styled(StyledEntry)`
  justify-content: space-between;
  align-items: center;
`;

const InnerModal = styled.div`
  max-width: 75%;
  max-height: 500px;
  background-color: white;
  padding: 40px;
  border-radius: 15px;
  margin-top: 10%;
`;

const FavLists = styled.div`
  height: 70%;
  overflow: auto;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DoneButton = styled.button`
  background-color: black;
  border-color: black;
  text-align: center;
  align-items: center;
  border-radius: 10px;
  padding: 10px 20px;
  color: white;
`;

const ImageAndText = styled.div`
  display: flex;
  align-items: center;
`;

export default Favorites;