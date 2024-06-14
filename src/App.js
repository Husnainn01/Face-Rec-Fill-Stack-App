import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // onButtonSubmit = () => {
  //   this.setState({imageUrl: this.state.input});

  //   const returnClarifaiRequestOptions = (imageUrl) => {
  //     const PAT = '0a3f420e5b8e41d4b1f4429a59a9ce6d';
  //     const USER_ID = '3g0qhsqffb70';       
  //     const APP_ID = 'my-first-application-5kmwi8';
  //     // const MODEL_ID = 'face-detection'; 
  //     const IMAGE_URL = imageUrl;

  //     const raw = JSON.stringify({
  //       "user_app_id": {
  //         "user_id": USER_ID,
  //         "app_id": APP_ID
  //       },
  //       "inputs": [
  //         {
  //           "data": {
  //             "image": {
  //               "url": IMAGE_URL
  //             }
  //           }
  //         }
  //       ]
  //     });

  //     const requestOptions = {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Authorization': 'Key ' + PAT
  //       },
  //       body: raw
  //     };
  //     return requestOptions;
  //   }

  //   fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, returnClarifaiRequestOptions(this.state.input))
  //     .then(response => response.json())
  //     .then(response => {
  //       if (response) {
  //         fetch('http://localhost:3000/image', {
  //           method: 'put',
  //           headers: {'Content-Type': 'application/json'},
  //           body: JSON.stringify({
  //             id: this.state.user.id
  //           })
  //         })
  //           .then(response => response.json())
  //           .then(count => {
  //             this.setState(Object.assign(this.state.user, { entries: count}))
  //           })
  //           .catch(err => console.log('Error updating entries:', err));
  //       }
  //       this.displayFaceBox(this.calculateFaceLocation(response))
  //     })
  //     .catch(err => console.log('Error fetching Clarifai API:', err));
  // }

    onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://api.clarifai.com/v2/models/face-detection/outputs', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Key 0a3f420e5b8e41d4b1f4429a59a9ce6d'
      },
      body: JSON.stringify({
        user_app_id: {
          user_id: '3g0qhsqffb70',
          app_id: 'my-first-application-5kmwi8'
        },
        inputs: [
          {
            data: {
              image: {
                url: this.state.input
              }
            }
          }
        ]
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        this.displayFaceBox(this.calculateFaceLocation(response));
      }
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;