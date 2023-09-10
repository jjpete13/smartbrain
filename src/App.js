import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particle from './components/Particles/Particles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';



const returnClarafaiRequestOptions = (imageUrl) => {
    const PAT = '8df9142c788842aabfa7f3956ff068d0';
    const USER_ID = 'jjpete13';       
    const APP_ID = 'my-API';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105"
    const IMAGE_URL = imageUrl;

const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};
  return requestOptions
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'SignIn',
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
    super()
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
  const clarafaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarafaiFace.left_col * width,
    topRow: clarafaiFace.top_row * height,
    rightCol: width - (clarafaiFace.right_col * width),
    bottomRow: height - (clarafaiFace.bottom_row * height)
  }
}

displayBox = (box) => {
  this.setState({box});
}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input})
  fetch("https://api.clarifai.com/v2/models/face-detection/outputs",
  returnClarafaiRequestOptions(this.state.input))
  .then(response =>response.json())
  .then(result => {
    if (result) {
      fetch('http://localhost:3000/image', {
        method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.user.id
      })
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, { entries: count}))
    })
    .catch(console.log)
  }
   this.displayBox(this.calculateFaceLocation(result))
 })
  .catch(error => console.log('error', error));
}

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

render() {
  const { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
     <div className="particlesBg" color="#ff0000" num={200} type="cobweb" bg={true}>
    <Particle />
    </div>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      {route === 'home' ?
        <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
         : (
         route === 'SignIn'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
         )
      }
    </div>
  );
};
}

export default App;