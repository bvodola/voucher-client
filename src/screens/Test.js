import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      success : false,
      url : ""
    }
  }
  
  handleChange = (ev) => {
    this.setState({success: false, url : ""});
    
  }
  // Perform the upload
  async handleUpload(file) {

    try {
      // Split the filename to get the name and type
      let fileParts = file.name.split('.');
      let fileName = fileParts[0];
      let fileType = fileParts[1];

      const postResponse = await axios.post("http://localhost:3000/aws/s3/sign", {
        fileName,
        fileType,
      });

      const { returnData } = postResponse.data.data;
      const { signedRequest, url } = returnData;
      this.setState({url});
      
      // Put the fileType in the headers for the upload
      var options = {
        headers: { 'Content-Type': fileType }
      };

      const putResponse = await axios.put(signedRequest,file,options);
      this.setState({success: true});
    } catch (err) {
      console.error('Test.js:handleUpload', err);
    }
  }
  
  
  render() {
    const Success_message = () => (
      <div style={{padding:50}}>
        <h3 style={{color: 'green'}}>SUCCESSFUL UPLOAD</h3>
        <a href={this.state.url}>Access the file here</a>
        <br/>
      </div>
    )
    return (
      <div className="App">
        <center>
          <h1>UPLOAD A FILE</h1>
          {this.state.success ? <Success_message/> : null}
          <input onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file"/>
          <br/>
          <button onClick={(ev) => this.handleUpload(this.uploadInput.files[0])}>UPLOAD</button>
        </center>
      </div>
    );
  }
}
export default App;